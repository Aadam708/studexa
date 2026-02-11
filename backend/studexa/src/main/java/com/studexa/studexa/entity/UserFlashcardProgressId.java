package com.studexa.studexa.entity;

import java.io.Serializable;
import java.util.Objects;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Allowing for the composite key to be used in findByID() in service and repo classes
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserFlashcardProgressId implements Serializable {

    private Long user;
    private Long flashcard;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserFlashcardProgressId that = (UserFlashcardProgressId) o;
        return Objects.equals(user, that.user) &&
               Objects.equals(flashcard, that.flashcard);
    }

    @Override
    public int hashCode() {
        return Objects.hash(user, flashcard);
    }
}
