package com.example.todolist.model

data class DayData(
    var tasks: MutableList<Task>,
    var completed: Int
)