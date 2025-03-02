package com.example.todolist

import android.view.inputmethod.EditorInfo
import android.widget.Button
import android.widget.EditText

fun setupAddTask(
    addTaskEditText: EditText,
    addTaskButton: Button,
    listener: TaskAdapter.TaskAdapterListener
) {
    addTaskButton.setOnClickListener {
        val title = addTaskEditText.text.toString()
        if (title.trim().isNotEmpty()) {
            listener.onTaskAdded(title)
            addTaskEditText.text.clear()
        }
    }

    addTaskEditText.setOnEditorActionListener { _, actionId, _ ->
        if(actionId == EditorInfo.IME_ACTION_DONE) {
            addTaskButton.performClick()
            true
        } else {
            false
        }
    }
}