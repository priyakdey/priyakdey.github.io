+++
title = 'Demystifying Java Strings: Understanding Referential Equality, Memory Allocation, and String Interning'
description = 'Dive deep into Java strings and unravel the differences between `==` and `equals()`, understand memory allocation during string creation, and explore the impact of String interning. Utilize tools like VisualVM, jcmd, and MAT for practical memory analysis.'
date = 2024-05-16T02:27:34+05:30
draft = true
categories = [ "java", "interview preparation" ]
tags = [ "java", "strings", "string interning", "memory", "interview preparation" ]
showViews = true
showLikes = true
+++

Java strings often come with a lot of questions, especially during interviews.
Two common topics are:

- Reference equality (`==`) vs the `equals()` method.
- The number of objects created when using string literals versus the `new`
  keyword.

While there are standard answers and plenty of online explanations, I wanted to 
explore the underlying memory allocation to understand the mechanisms at play. 
For instance, creating strings with literals typically results in a single 
object, whereas using the `new` keyword creates two objects.

However, this topic piqued my curiosity, raising additional questions each time I delved deeper:

- `String s = "Hello"` creates one object, but what about the backing array of characters or bytes?
- What happens if I instantiate a string with a sequence of bytes instead of literals?
- What and how the
  [String#intern](<https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/String.html#intern()>)
  method work.


To explore these questions yourself, all you need is a JDK distribution and 
a memory analyzer. The plan is simple: run some code that allocates string 
objects, take heap dumps and histograms, and analyze them. 
For this experiment, I'm using:
- Open JDK: 21.ea.32-open
- [VisualVM](https://visualvm.github.io/)

{{< codeimporter url="https://github.com/priyakdey/java-string-allocation-analyzer/blob/main/src/main/java/com/priyakdey/DoubleStringLiteralAllocation.java#L16" type=java" >}}


{{< alert icon="none" cardColor="#dd3946" iconColor="#f1faee" textColor="#f1faee" >}}
To properly analyze, we want to minimze any allocations post String allocation, hence a lot of pre-allocation of diagnostic helper process is done with duplicate code. Clean code has its place, but for this experiment, duplicates are fine.
for more details. 
**NOTE**: Running a CLI application and taking heap dumps or histograms might seem challenging, especially with just a few lines of code. Therefore, I used the CLI to take pre-allocation and post-allocation heap dumps. To minimize post-allocation of the objects we want to test out, everything is pre-allocated.
```java
    public static void main(String[] args) throws Exception {
        jvmHeapDiagnosticHelper.takePreAllocHistDump();
        jvmHeapDiagnosticHelper.takePreAllocHeapDump();

        String s1 = "Hello, World";

        // pre-allocate everything for next steps.
        // allocations should be minimzed, speciall for String 
        // post above string instantiation, for easy analysis
        // of the dump.

        jvmHeapDiagnosticHelper.takePostAllocHistDump();
        jvmHeapDiagnosticHelper.takePostAllocHeapDump();
    }
```{{< /alert >}}



The idea is to pre-allocate everything needed for the process to run so that 
nothing is allocated during string allocation, except for the strings themselves.

_The background image is designed by [Freepik](https://www.freepik.com/)._
