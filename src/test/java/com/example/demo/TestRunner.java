package com.example.demo;

import org.testng.TestNG;
import java.util.ArrayList;
import java.util.List;

public class TestRunner {
    public static void main(String[] args) {
        TestNG testng = new TestNG();
        List<String> suites = new ArrayList<>();
        suites.add("src/test/resources/testng.xml");
        testng.setTestSuites(suites);
        testng.run();
    }
}