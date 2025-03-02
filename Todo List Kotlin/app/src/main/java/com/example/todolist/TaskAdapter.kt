package com.example.todolist

import android.view.KeyEvent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.EditorInfo
import android.widget.*
import androidx.recyclerview.widget.RecyclerView
import com.example.todolist.model.Task

class TaskAdapter(
    private var tasks: MutableList<Task>,
    private val listener: TaskAdapterListener
) : RecyclerView.Adapter<TaskAdapter.TaskViewHolder>() {

    interface TaskAdapterListener {
        fun onTaskToggled(task: Task)
        fun onTaskDeleted(task: Task)
        fun onTaskAdded(title: String)
    }

    inner class TaskViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val checkbox: CheckBox = view.findViewById(R.id.taskCheckbox)
        val titleText: TextView = view.findViewById(R.id.taskTitleText)
        val deleteButton: ImageButton = view.findViewById(R.id.deleteTaskButton)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TaskViewHolder {
        val view =
            LayoutInflater.from(parent.context).inflate(R.layout.item_task, parent, false)
        return TaskViewHolder(view)
    }

    override fun getItemCount(): Int = tasks.size

    override fun onBindViewHolder(holder: TaskViewHolder, position: Int) {
        val task = tasks[position]
        holder.titleText.text = task.title
        holder.checkbox.isChecked = task.completed

        holder.checkbox.setOnClickListener {
            listener.onTaskToggled(task)
        }

        holder.deleteButton.setOnClickListener {
            listener.onTaskDeleted(task)
        }
    }

    fun updateTasks(updatedTasks: MutableList<Task>) {
        tasks = updatedTasks
        notifyDataSetChanged()
    }
}