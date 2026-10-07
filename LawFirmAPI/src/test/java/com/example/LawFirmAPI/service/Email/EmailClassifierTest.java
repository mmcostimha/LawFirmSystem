package com.example.LawFirmAPI.service.Email;

import org.junit.jupiter.api.Test;
import java.util.Arrays;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;

public class EmailClassifierTest {

    private final EmailClassifier classifier = new EmailClassifier();
    // sem mocks ou Spring - funcao pura: n depende de nada, recebe um parametro
    // gospe uma resposta.
    //Cria EmailClassifier.java em service/Email/. Sem @Service, sem imports de Spring nem de jakarta.mail. É isso que a torna "pura".

    @Test
    void EmailClassifier_ShouldTriggerAlarm_ReturnsTrue_WhenSenderContainsType(){
        List<String> sender = List.of("newsletter@loja.pt", "notificacoes@tribunal.pt");
        String type = "tribunal";
        assertThat(classifier.shouldTriggerAlarm(sender,type)).isTrue();
    }

    @Test
    void  EmailClassifier_ShouldTriggerAlarm_ReturnsFalse_WhenNoSenderContainsType(){
        assertThat(classifier.shouldTriggerAlarm(List.of("a@loja.pt"), "tribunal")).isFalse();
    }

    @Test
    void  EmailClassifier_ShouldTriggerAlarm_ReturnsFalse_WhenSenderIsEmpty() {
        assertThat(classifier.shouldTriggerAlarm(List.of(),"tribunal")).isFalse();
    }
    @Test
    void  EmailClassifier_ShouldTriggerAlarm_ReturnsFalse_WhenTypeIsEmptyOrNull() {
        List<String> sender = List.of("a@tribunal.pt");
        assertThat(classifier.shouldTriggerAlarm(sender, "")).isFalse();
        assertThat(classifier.shouldTriggerAlarm(sender, "   ")).isFalse();
        assertThat(classifier.shouldTriggerAlarm(sender, null)).isFalse();
    }
    @Test
    void  EmailClassifier_ShouldTriggerAlarm_ReturnsTrue_WhenSomeSenderAreNull() {
        List<String> sender = Arrays.asList("a@tribunal.pt",null);
        assertThat(classifier.shouldTriggerAlarm(sender, "tribunal")).isTrue();
    }

}
