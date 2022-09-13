---
title: "Churning objects from a Factory"
date: 2022-09-13T23:09:57+05:30
description: "Using factory and strategy design patterns with Springboot"
type: "post"
tags: ["design patterns", "creational design pattern", "factory design pattern","java", "springboot"]
draft: false
---


> The Factory pattern provides a way to use an instance as a object factory.
> The factory can return an instance of one of several possible classes (in a
> subclass hierarchy), depending on the data provided to it.

The factory design pattern is mostly used when we cannot anticipate which object type
to be instantiated during runtime. The type required during runtime would mostly depend
on one or more parameters.

When we talk about *`return an instance of one of several possible classes`*, we are 
talking about the **same type** (hierarchy exits). If one factory is used to return multiple types,
then we would be breaking the [SRP](https://java-design-patterns.com/principles/#single-responsibility-principle) 
and [OCP](https://java-design-patterns.com/principles/#openclosed-principle).


I came across a similar situation where our service was exposed to different types of clients (UI, internal backend systems, 
external backend systems).
Different clients had to be validated with a differnent **strategy**.
Example if requests lands from UI, we are expecting to authorize the user validaity using an org-wide entitlement-service;
calls coming from the internet are to be validated using some metadata in the http headers.


So we decided to figure out our client type using HttpHeaders. 
The client needs to send their Application Id in the header as APP_ID.  
Depending on the flow we can easily do the following:

```java
public boolean isAuthorized(HttpServletRequest request) {
    String appId = request.getHeader("APP_ID");
    // appId != null and appId is supported is already done
    if ("CLIENT1".equals(appId)) {
        // invoke client1 validation flow
    } else if ("CLIENT2".equals(appId)) {
        // invoke client2 validation flow   
    }
    // some other things maybe and then return
}
```


Though this looks intuitive, a big issue is supporting different clients as the application
grows old. We gotta keep coming back to this class, opening this method and modifying it.
So we have to come up with a solution which is more extensible.


A combination **Factory and Strategy** design comes to our rescue.

> Use strategy when you need to define a family of algorithms, encapsulate
> each one, and make them interchangeable. Strategy lets the algorithm vary
> independently from clients that use it.


To explain this using a real-word example, lets take the below example.
We are a logistics company are given the task of creating a 
application which helps process order details.

As the company scaled, they supported on-road, shipping, by-air and other ways 
of transporting goods. Different clients books orders with us and depending on the
type, we have different systems handling the orders.
EOD all systems push order details DataLake for archivals and future insights.
Over the years different LOB came up and different systems are build differently and export
data in a different format.

Our task is to create an application which accepts data(any format - csv/xml/json/excel, etc).
Even for JSON we are assuming we are expecting a json file instead of an API call for bulk uploads.

We have created a api `/api/v1/orders/upload` to accept the file:
```java
@PostMapping
public ResponseEntity<Void> uploadFile(@RequestParam("file") MultipartFile file) {
    if (file.isEmpty()) {
        throw new BadRequestException("Empty file cannot be processed");
    }
    // this is something we can do
    String fileType = getFileType(file);
    if ("csv".equals(fileType)) {
        // create a CSVParser and process data
    } else if ("xml".equals(fileType)) {
        // create a XMLParser and process data
    }
    return ResponseEntity.ok().build();
}
```

The issue here is what we discussed before, for supporting different types, we need to open the class and modify.
Also the controller which should have just handed the request, is now also resposible for creating the Parsers and
managing its lifecyle.

Yes, we can extract this to a service and let service handle the creation and the decision making. Yet our
decision making is just a bunch of if-else, which other than looking ugly is breaking OCP.

Here is where a combination of strategy and factory comes to our rescue.

If you think a little, how we parse the file is just a strategy(depending on the format of the data we parse the file
using a different algorithm - for csv we split on commas, for xml we can build a tree of tags).

So the first thing we can do is create an abstraction called `FileProcessor` which exposes and API to parse and process
the file. It takes in a file and returns a list of `Order`.

```java
public interface FileProcessor {
    List<Order> processFile(File file) throws Exception;        // Takes in a file and sends us back the List of orders

    FileType getType();
}
```

Now that we created this abstraction, lets define some concrete types.

```java
@Slf4j
@Service
public class CSVFileProcessorImpl implements FileProcessor {

    @Override
    public List<Order> processFile(File file) throws Exception {
        log.info("Processing file {}", file.getName());
        Parser parser = new CSVParser();
        List<String[]> parsedContent = parser.parse(file);
        return parsedContent.stream().map(this::mapToBean).collect(toList());
    }

    @Override
    public FileType getType() {
        return CSV;
    }

    private Order mapToBean(String[] arr) {
        Order order = new Order();
        order.setInvoiceId(arr[0]);
        order.setAmount(BigDecimal.valueOf(Double.parseDouble(arr[1])));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("%MM/%dd%yyyy");
        order.setInvoiceDate(LocalDate.parse(arr[2], formatter));
        order.setCompany(arr[3]);
        return order;
    }

}
```

We not only created sub-classes of `FileProcessor`, we have also delegated the
creation and managing the Parser to its  subclass.
This decouples our service `OrderProcessorServiceImpl` from managing the lifecyle of the `Parser`.

Now we have defined different strategies to parse the file, this becomes easy to support 
different types in the future. But the main issue still remains;

We are expecing the service to decide which `FileProcessor` to instantiate and use.
This is where the `FileProcessorFactory` comes handy, which decouples this creation
and decision from the client.

Looking at the `FileProcessorFactory` class:
```java
@Slf4j
@Component
public class FileProcessorFactory {
    private final Map<FileType, FileProcessor> fileProcessorMap;

    public FileProcessorFactory(Set<FileProcessor> fileProcessors) {
        fileProcessorMap = new HashMap<>();
        fileProcessors.forEach(fileProcessor -> fileProcessorMap.put(fileProcessor.getType(), fileProcessor));
    }

    public FileProcessor getProcessor(String contentType) {
        FileType fileType = FileType.getFileType(contentType);
        if (fileType == null) {
            throw new UnsupportedFileFormatException(
                    contentType + "is not supported yet. Only csv, xml and excel is supported");
        }
        return fileProcessorMap.get(fileType);
    }

}
```

It is a spring managed bean, which when instantiates does keep a copy of all the `FileProcessor` in a map,
the key being an enum `FileType`.
This helps the `getProcessor(String contentType)` method accept a file format type and return the correct processor.
This pattern though a little complex than if-else becomes more extensible.

Let us say, we want to support a FixedWidth flat file in 6 months, all we need to do is create a new `FileProcessor`,
a new `Parser` and add the new supported type in the `FileType` enum.
This would also mean, we dont touch the existing classes to modify, which means what was working still works
without any issue.

The UML digram of the application gives a better picture of the design.

![UML Diagram](https://raw.githubusercontent.com/priyakdey/design-pattern-usage-java/factory-design/order-details-processing-service-uml.jpg)


**Note**: There are couple of code smells - Parsers are being created multiple times when we can allow Spring create and manage 
the lifecyle of the parsers. I think an Abstract Factory can be used for more decoupling. But keeping things simple for this use case.


**References**
- [codebase link](https://github.com/priyakdey/design-pattern-usage-java/tree/factory-design)
- [java-design-patterns.com](https://java-dedesign-patterns.com/)
- [Christopher Okhravi Design Pattern playlist](https://www.youtube.com/watch?v=v9ejT8FO-7I&list=PLrhzvIcii6GNjpARdnO4ueTUAVR9eMBpc)
- [Geekific Design Pattern playlist](https://www.youtube.com/watch?v=mE3qTp1TEbg&list=PLlsmxlJgn1HJpa28yHzkBmUY-Ty71ZUGc)