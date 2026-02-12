package com.studexa.studexa.mapper;

import org.springframework.stereotype.Component;
import com.studexa.studexa.dto.UserDto;
import com.studexa.studexa.entity.User;

@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserDto toDto(User user) {
        if (user == null) return null;
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        return dto;
    }

    @Override
    public User toEntity(UserDto dto) {
        if (dto == null) return null;
        User u = new User();
        u.setId(dto.getId());
        u.setFirstName(dto.getFirstName());
        u.setLastName(dto.getLastName());
        u.setEmail(dto.getEmail());
        u.setRole(dto.getRole());
        return u;
    }
}
