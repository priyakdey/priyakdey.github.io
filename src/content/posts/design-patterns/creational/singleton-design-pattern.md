---
title: "Singleton - The Only One"
date: 2022-05-29T18:30:45+05:30
description: "The singleton design pattern"
type: "post"
tags: ["java", "singleton", "design patterns", "creational design pattern", "gang of four"]
draft: true
---

## Table of Content

- [Table of Content](#table-of-content)
  - [Definition](#definition)
  - [UML Diagram](#uml-diagram)


### Definition

According to the Gang of Four, the definition of singleton goes like:
> *The singleton pattern ensures the class has **only one instance** and provides a global access point of access to it.*

Singleton is a *creational design pattern*; and as the name suggests, the intent of this design pattern is to ensure that
a single copy of the instance is created. This pattern talks about how to create an object and hence the classification *creational*.

This is probably one of the most widely answered design pattern when asked in an interview. Reason being its simplicity and the
very use of singleton beans in most popular framework Spring. While most of the internet says *only one instance across the application*,
I beg to differ with this statement.

In my opinion and words, singleton design can be defined as:
> *A singleton is ensured to have only one instance of itself across the **context of the scope**.*

Context of the scope being the keywords here; the context if is the application, the singleton ensures a single copy across the whole
of heap. If we are talking in terms of singleton beans in Spring, the scope of the bean is to the ApplicationContext. 


Breaking down the definition, the singleton class, as the name suggests, ensure that a single copy of the object
is present in referred context of the object.



### UML Diagram

Hello