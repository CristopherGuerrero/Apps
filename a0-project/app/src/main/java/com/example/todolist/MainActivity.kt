package com.example.todolist

import android.animation.ObjectAnimator
import android.os.Bundle
import android.view.View
import android.view.animation.DecelerateInterpolator
import android.widget.CalendarView
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.todolist.data.DataUtils
import com.example.todolist.model.DayData
import com.example.todolist.model.Task

class MainActivity : AppCompatActivity(), TaskAdapter.TaskAdapterListener {

    private lateinit var calendarView: CalendarView
    private lateinit var tasksRecyclerView: RecyclerView
    private lateinit var statsTextView: TextView
    private lateinit var checkImageView: ImageView

    // Datos del calendario
    private var calendarData: MutableMap<String, DayData> = DataUtils.generateInitialData()
    // Fecha seleccionada (en formato yyyy-MM-dd)
    private var selectedDate: String = DataUtils.getTodayString()
    private lateinit var taskAdapter: TaskAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        calendarView = findViewById(R.id.calendarView)
        tasksRecyclerView = findViewById(R.id.tasksRecyclerView)
        statsTextView = findViewById(R.id.statsTextView)
        checkImageView = findViewById(R.id.checkImageView)        checkImageView.visibility = View.INVISIBLE

        // Configuración para agregar nueva tarea
        val addTaskEditText: EditText = findViewById(R.id.addTaskEditText)
        val addTaskButton: Button = findViewById(R.id.addTaskButton)
        setupAddTask(addTaskEditText, addTaskButton, object : TaskAdapter.TaskAdapterListener {
            override fun onTaskToggled(task: Task) {
                this@MainActivity.onTaskToggled(task)
            }
            override fun onTaskDeleted(task: Task) {
                this@MainActivity.onTaskDeleted(task)
            }
            override fun onTaskAdded(title: String) {
                this@MainActivity.onTaskAdded(title)
            }
        })
        
        // Inicializamos RecyclerView
        tasksRecyclerView.layoutManager = LinearLayoutManager(this)
        val tasks = getTasksForDate(selectedDate)
        taskAdapter = TaskAdapter(tasks, this)
        tasksRecyclerView.adapter = taskAdapter

        updateStats()

        calendarView.setOnDateChangeListener { _, year, month, dayOfMonth ->
            val monthFixed = month + 1
            selectedDate = String.format("%04d-%02d-%02d", year, monthFixed, dayOfMonth)
            loadTasksForSelectedDate()
        }
    }

    private fun loadTasksForSelectedDate() {
        val tasks = getTasksForDate(selectedDate)
        taskAdapter.updateTasks(tasks)
        updateStats()
        animateCompletionIfNeeded(tasks)
    }

    private fun getTasksForDate(date: String): MutableList<Task> {
        return if (calendarData.containsKey(date)) {
            calendarData[date]?.tasks ?: mutableListOf()
        } else {
            // Si no existe, se crea un día sin tareas
            calendarData[date] = DayData(mutableListOf(), 0)
            mutableListOf()
        }
    }

    override fun onTaskToggled(task: Task) {
        val tasks = getTasksForDate(selectedDate)
        val index = tasks.indexOfFirst { it.id == task.id }
        if (index != -1) {
            tasks[index].completed = !task.completed
            // Actualizamos el contador
            val completedCount = tasks.count { it.completed }
            calendarData[selectedDate]?.completed = completedCount
            taskAdapter.updateTasks(tasks)
            updateStats()
            animateCompletionIfNeeded(tasks)
        }
    }

    override fun onTaskDeleted(task: Task) {
        val tasks = getTasksForDate(selectedDate)
        tasks.removeAll { it.id == task.id }
        val completedCount = tasks.count { it.completed }
        calendarData[selectedDate]?.completed = completedCount
        taskAdapter.updateTasks(tasks)
        updateStats()
        animateCompletionIfNeeded(tasks)
    }

    override fun onTaskAdded(title: String) {
        val tasks = getTasksForDate(selectedDate)
        if(title.trim().isEmpty()) return
        // Se crea una tarea nueva con un id basado en el tiempo
        val newTask = Task(System.currentTimeMillis().toString(), title, false)
        tasks.add(newTask)
        calendarData[selectedDate]?.tasks = tasks
        val completedCount = tasks.count { it.completed }
        calendarData[selectedDate]?.completed = completedCount
        taskAdapter.updateTasks(tasks)
        updateStats()
        animateCompletionIfNeeded(tasks)
    }

    private fun updateStats() {
        // Se calculan estadísticas semanales y mensuales basadas en calendarData
        val weeklyStats = DataUtils.getWeeklyStats(calendarData)
        val monthlyStats = DataUtils.getMonthlyStats(calendarData)
        statsTextView.text = "Semana: ${weeklyStats.first}/${weeklyStats.second}  -  Mes: ${monthlyStats.first}/${monthlyStats.second}"
    }

    private fun animateCompletionIfNeeded(tasks: List<Task>) {
        if (tasks.isNotEmpty() && tasks.all { it.completed }) {
            checkImageView.visibility = View.VISIBLE
            val animator = ObjectAnimator.ofFloat(checkImageView, "scaleX", 0f, 1f)
            animator.duration = 500
            animator.interpolator = DecelerateInterpolator()
            animator.start()

            val animatorY = ObjectAnimator.ofFloat(checkImageView, "scaleY", 0f, 1f)
            animatorY.duration = 500
            animatorY.interpolator = DecelerateInterpolator()
            animatorY.start()
        } else {        checkImageView.visibility = View.INVISIBLE

        // Configuración para agregar nueva tarea
        val addTaskEditText: EditText = findViewById(R.id.addTaskEditText)
        val addTaskButton: Button = findViewById(R.id.addTaskButton)
        setupAddTask(addTaskEditText, addTaskButton, object : TaskAdapter.TaskAdapterListener {
            override fun onTaskToggled(task: Task) {
                this@MainActivity.onTaskToggled(task)
            }
            override fun onTaskDeleted(task: Task) {
                this@MainActivity.onTaskDeleted(task)
            }
            override fun onTaskAdded(title: String) {
                this@MainActivity.onTaskAdded(title)
            }
        })
        }
    }
}