import { useState, useEffect } from "react";
import { mealLogService } from "../services/mealLogService";
import { reactionService } from "../services/reactionService";



export interface Meal {
  id: string;
  name: string;
  time: string;
  ingredients: string[];
  symptoms: { name: string; severity: number; time: string }[];
  unsafeIngredients: string[];
  color: string;
}

export interface WeekLog {
  date: Date;
  dayName: string;
  dayNumber: number;
  meals: Meal[];
  isExpanded: boolean;
}

export function getMealLogByWeek(date: string, userId: string) {


  const [weekLogs, setWeekLogs] = useState<WeekLog[]>([]);
  /*const [dayLogs, setDayLogs] = useState<DayLog[]>([
    {
      date: new Date(2021, 6, 19),
      dayName: 'SAT',
      dayNumber: 19,
      isExpanded: true,
      meals: [
        {
          id: '1',
          name: 'Pancakes and eggs',
          time: '4:05 PM',
          ingredients: ['Cheerios', 'Eggs', 'Syrup', 'Wheat'],
          symptoms: [
            { name: 'itch', severity: 4, time: '3:50 PM' }
          ],
          unsafeIngredients: ['Eggs', 'Wheat'],
          color: '#FF9E80',
        },
        {
          id: '2',
          name: 'Mac and cheese',
          time: '4:05 PM',
          ingredients: ['Cheerios', 'Eggs', 'Syrup', 'Wheat'],
          symptoms: [],
          unsafeIngredients: [],
          color: '#9ACD32',
        },
      ],
    },
    {
      date: new Date(2021, 6, 20),
      dayName: 'SUN',
      dayNumber: 20,
      isExpanded: false,
      meals: [],
    },
  ]);*/
  useEffect(() => {
    const fetchData = async () => {
      try {
        const mealRes = await mealLogService.getMealLogByWeek({ date, userId });
        const mealLogs = mealRes.data;
        console.log(mealLogs)
        //mealLogService.forEach((meal) =>{})
        const meals: Meal[] = mealLogs.map((log: any) => ({
          id: log._id,
          name: log.mealName,
          time: new Date(log.created).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          ingredients: log.ingredients.map((i: any) => i.name),
          symptoms: log.reaction?.map((r: any) => ({
            name: r.symptom,
            severity: r.severity ?? 0,
            time: new Date(r.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          })) || [],
          unsafeIngredients: log.ingredients
            .filter((i: any) => i.allergens?.length > 0)
            .map((i: any) => i.name),
          color: "#FFA07A",
        }));

        const dateObj = new Date(date);
        const weeklyLog: WeekLog = {
          date: dateObj,
          dayName: dateObj.toLocaleString("en-US", { weekday: "short" }).toUpperCase(),
          dayNumber: dateObj.getDate(),
          isExpanded: true,
          meals,
        };

        setWeekLogs([weeklyLog]);
      } catch (err) {
        console.error("Failed to fetch meal log data", err);
      }
    };

    fetchData();
  }, [date, userId]);

  return { weekLogs };
}
