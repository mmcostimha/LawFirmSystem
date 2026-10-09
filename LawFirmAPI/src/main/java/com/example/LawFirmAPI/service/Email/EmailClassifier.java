package com.example.LawFirmAPI.service.Email;

import org.springframework.stereotype.Component;
import java.util.Collection;
import java.util.Objects;

@Component
public class EmailClassifier {

    public boolean shouldTriggerAlarm(Collection<String> senders, String type){

        if (type == null || type.isBlank())
            return false;

        return senders.stream()
                .filter(Objects::nonNull)
                .filter(sender-> !sender.isEmpty())
                .anyMatch(sender -> sender.contains(type));
    }
}
