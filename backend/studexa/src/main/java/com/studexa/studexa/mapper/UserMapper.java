package com.studexa.studexa.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.studexa.studexa.dto.UserDto;
import com.studexa.studexa.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    UserDto toDto(User user);
    User toEntity(UserDto dto);
}
