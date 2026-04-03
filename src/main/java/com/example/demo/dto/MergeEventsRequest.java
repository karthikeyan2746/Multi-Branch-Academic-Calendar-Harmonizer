package com.example.demo.dto;
import java.util.List;
public class MergeEventsRequest {
    private List<Long> eventIds;
    private String reason;
    public List<Long> getEventIds() { return eventIds; }
    public void setEventIds(List<Long> eventIds) { this.eventIds = eventIds; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}