package com.example.todolist.data

import com.example.todolist.model.DayData
import com.example.todolist.model.Task
import java.text.SimpleDateFormat
import java.util.*

object DataUtils {

    private val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())

    fun getTodayString(): String {
        return dateFormat.format(Date())
    }

    fun generateInitialData(): MutableMap<String, DayData> {
        val data = mutableMapOf<String, DayData>()
        val today = Date()
        val todayStr = dateFormat.format(today)

        val tasksToday = mutableListOf(
            Task("1", "Ejercicio matutino", false),
            Task("2", "Revisar emails", false),
            Task("3", "Reunión de equipo", false),
            Task("4", "Completar proyecto", false),
            Task("5", "Actualizar calendario", false),
            Task("6", "Llamar a cliente", false),
            Task("7", "Leer 20 minutos", false)
        )
        data[todayStr] = DayData(tasksToday, 0)

        // Datos de ayer para ejemplo
        val cal = Calendar.getInstance()
        cal.time = today
        cal.add(Calendar.DAY_OF_YEAR, -1)
        val yesterdayStr = dateFormat.format(cal.time)
        val tasksYesterday = mutableListOf(
            Task("8", "Ejercicio matutino", true),
            Task("9", "Revisar emails", true),
            Task("10", "Comprar víveres", true),
            Task("11", "Llamar a mamá", false),
            Task("12", "Leer 20 minutos", true)
        )
        data[yesterdayStr] = DayData(tasksYesterday, 4)

        return data
    }

    fun getWeeklyStats(data: Map<String, DayData>): Pair<Int, Int> {
        val calendar = Calendar.getInstance()
        // Ajustamos al inicio de la semana (en Android la primer parte es domingo)
        calendar.set(Calendar.DAY_OF_WEEK, calendar.firstDayOfWeek)
        val startOfWeek = calendar.time
        var completed = 0
        var total = 0
        data.forEach { (dateStr, dayData) ->
            val date = dateFormat.parse(dateStr)
            if (date != null && !date.before(startOfWeek)) {
                completed += dayData.completed
                total += dayData.tasks.size
            }
        }
        return Pair(completed, total)
    }

    fun getMonthlyStats(data: Map<String, DayData>): Pair<Int, Int> {
        val calendar = Calendar.getInstance()
        val currentMonth = calendar.get(Calendar.MONTH)
        val currentYear = calendar.get(Calendar.YEAR)
        var completed = 0
        var total = 0
        data.forEach { (dateStr, dayData) ->
            val date = dateFormat.parse(dateStr)
            if (date != null) {
                calendar.time = date
                if (calendar.get(Calendar.MONTH) == currentMonth && calendar.get(Calendar.YEAR) == currentYear) {
                    completed += dayData.completed
                    total += dayData.tasks.size
                }
            }
        }
        return Pair(completed, total)
    }
}