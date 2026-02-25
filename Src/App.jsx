import { useState, useEffect } from “react”;

const DAYS = [
{ id: 1, label: “Day 1”, title: “Lower Body Strength & Explosiveness”, color: “#e74c3c”, icon: “🏋️” },
{ id: 2, label: “Day 2”, title: “Upper Body Strength & Stunt Power”, color: “#2980b9”, icon: “💪” },
{ id: 3, label: “Day 3”, title: “Conditioning + Mobility”, color: “#8e44ad”, icon: “🏃” },
{ id: 4, label: “Day 4”, title: “Lower Body & Tumbling Power”, color: “#e67e22”, icon: “🤸” },
{ id: 5, label: “Day 5”, title: “Upper Body Endurance & Conditioning”, color: “#1a3a5c”, icon: “⚡” },
{ id: 6, label: “Day 6”, title: “Active Recovery & Flexibility”, color: “#27ae60”, icon: “🧘” },
{ id: 7, label: “Day 7”, title: “Full Body Strength & Explosiveness”, color: “#d4ac0d”, icon: “🔥” },
];

const EXERCISES = {
1: [“Back Squat 5×5”, “Romanian Deadlift 4×8”, “Bulgarian Split Squat 3×10”, “Box Jumps 3×8”, “Broad Jumps 3×6”, “Hanging Leg Raises 3×12”, “Pallof Press 3×12”],
2: [“Bench Press 5×5”, “Pull-Ups 4×Max”, “DB Shoulder Press 3×10”, “Farmer’s Carries 3×40m”, “Handstand Practice”, “Partner Resistance Drills”],
3: [“Interval Sprints 10×30s”, “Battle Ropes 3×45s”, “Plank Variations 3×60s”, “Yoga/Stretch Flow 30min”],
4: [“Deadlift 5×5”, “Front Squat 4×6”, “Step-Ups 3×12”, “Box Jumps 3×8”, “Ab Rollouts 3×12”, “Splits Practice”],
5: [“Push-Ups 4×Max”, “Inverted Rows 4×12”, “DB Snatch 3×10”, “Med Ball Slams 3×15”, “Agility Ladder”, “Cone Drills”],
6: [“Yoga Flow 30-40min”, “Hip Openers”, “Hamstring Stretches”, “Shoulder Mobility”, “Light Cardio (optional)”],
7: [“Clean and Press 4×6”, “Kettlebell Swings 3×15”, “Pull-Ups 4×Max”, “Walking Lunges 3×12”, “Stability Ball Rollouts”, “Side Plank 3×30s”],
};

const FLEX_GOALS = [
{ id: “right_split”, label: “Right Split”, icon: “🦵” },
{ id: “left_split”, label: “Left Split”, icon: “🦵” },
{ id: “middle_split”, label: “Middle Split”, icon: “🤸” },
{ id: “scorpion”, label: “Scorpion”, icon: “🦂” },
{ id: “heel_stretch”, label: “Heel Stretch”, icon: “⭐” },
{ id: “bow_arrow”, label: “Bow & Arrow”, icon: “🏹” },
{ id: “back_walkover”, label: “Back Walkover”, icon: “🔄” },
{ id: “back_handspring”, label: “Back Handspring”, icon: “⚡” },
];

const MEALS = [“Breakfast”, “Snack 1”, “Lunch”, “Pre-Workout”, “Dinner”, “Evening Snack”];
const SUPPS = [“Whey Protein”, “Creatine”, “Omega-3”, “Vitamin D3”, “Magnesium”, “Vitamin C”, “B-Complex”];

function getTodayKey() {
return new Date().toISOString().split(“T”)[0];
}

const defaultData = () => ({
workouts: {},
meals: {},
water: {},
supps: {},
flex: {},
weight: {},
cheerNotes: {},
});

const STORAGE_KEY = “cheer-tracker-v2”;

function loadData() {
try {
const raw = localStorage.getItem(STORAGE_KEY);
return raw ? JSON.parse(raw) : defaultData();
} catch (e) {
return defaultData();
}
}

function saveData(data) {
try {
localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
} catch (e) {}
}

export default function App() {
const [data, setData] = useState(defaultData());
const [tab, setTab] = useState(“today”);
const [saving, setSaving] = useState(false);
const [loaded, setLoaded] = useState(false);
const today = getTodayKey();

useEffect(() => {
setData(loadData());
setLoaded(true);
}, []);

function save(newData) {
setData(newData);
saveData(newData);
setSaving(true);
setTimeout(() => setSaving(false), 600);
}

function toggleExercise(dayId, ex) {
const nd = { …data };
if (!nd.workouts[today]) nd.workouts[today] = { dayId, completed: [], notes: “” };
nd.workouts[today].dayId = dayId;
const list = nd.workouts[today].completed;
nd.workouts[today].completed = list.includes(ex) ? list.filter(x => x !== ex) : […list, ex];
save(nd);
}

function toggleMeal(meal) {
const nd = { …data };
if (!nd.meals[today]) nd.meals[today] = {};
nd.meals[today][meal] = !nd.meals[today]?.[meal];
save(nd);
}

function toggleSupp(s) {
const nd = { …data };
if (!nd.supps[today]) nd.supps[today] = {};
nd.supps[today][s] = !nd.supps[today]?.[s];
save(nd);
}

function setWater(v) {
const nd = { …data };
nd.water[today] = Math.max(0, Math.min(5000, v));
save(nd);
}

function setWeight(v) {
const nd = { …data };
nd.weight[today] = v;
save(nd);
}

function setFlexLevel(id, level) {
const nd = { …data };
if (!nd.flex[id]) nd.flex[id] = { level: 0, notes: “”, date: today };
nd.flex[id] = { …nd.flex[id], level, date: today };
save(nd);
}

function setCheerNote(txt) {
const nd = { …data };
nd.cheerNotes[today] = txt;
save(nd);
}

function setWorkoutNote(txt) {
const nd = { …data };
if (!nd.workouts[today]) nd.workouts[today] = { dayId: null, completed: [], notes: “” };
nd.workouts[today].notes = txt;
save(nd);
}

function getStreak() {
let streak = 0;
let d = new Date();
for (let i = 0; i < 30; i++) {
const key = d.toISOString().split(“T”)[0];
if (data.workouts[key]?.completed?.length > 0) streak++;
else if (i > 0) break;
d.setDate(d.getDate() - 1);
}
return streak;
}

function getWeekDays() {
const days = [];
const d = new Date();
const dow = d.getDay();
for (let i = dow; i >= 0; i–) {
const dd = new Date(d); dd.setDate(d.getDate() - i);
days.push(dd.toISOString().split(“T”)[0]);
}
for (let i = 1; i < 7 - dow; i++) {
const dd = new Date(d); dd.setDate(d.getDate() + i);
days.push(dd.toISOString().split(“T”)[0]);
}
return days;
}

const todayWorkout = data.workouts[today] || { dayId: null, completed: [], notes: “” };
const todayMeals = data.meals[today] || {};
const todaySupps = data.supps[today] || {};
const todayWater = data.water[today] || 0;
const todayWeight = data.weight[today] || “”;
const streak = getStreak();
const weekDays = getWeekDays();

const mealsDone = MEALS.filter(m => todayMeals[m]).length;
const suppsDone = SUPPS.filter(s => todaySupps[s]).length;
const exDone = todayWorkout.completed.length;
const exTotal = todayWorkout.dayId ? EXERCISES[todayWorkout.dayId]?.length || 0 : 0;
const waterPct = Math.min(100, (todayWater / 3500) * 100);

if (!loaded) return (
<div style={{ background: “#0d1117”, minHeight: “100vh”, display: “flex”, alignItems: “center”, justifyContent: “center” }}>
<div style={{ color: “#e74c3c”, fontSize: 32, fontFamily: “Georgia, serif”, letterSpacing: 4 }}>LOADING…</div>
</div>
);

return (
<div style={{ background: “#0d1117”, minHeight: “100vh”, fontFamily: “‘Georgia’, serif”, color: “#f0f0f0”, paddingBottom: 60 }}>
<style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Crimson+Pro:ital,wght@0,300;0,600;1,300&display=swap'); * { box-sizing: border-box; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0d1117; } ::-webkit-scrollbar-thumb { background: #e74c3c; border-radius: 2px; } .tab-btn { background: transparent; border: 1px solid #2a2a2a; color: #888; padding: 8px 18px; cursor: pointer; font-family: 'Bebas Neue', serif; font-size: 15px; letter-spacing: 2px; transition: all 0.2s; border-radius: 2px; } .tab-btn:hover { border-color: #e74c3c; color: #e74c3c; } .tab-btn.active { background: #e74c3c; border-color: #e74c3c; color: #fff; } .check-btn { width: 28px; height: 28px; border-radius: 50%; border: 2px solid #333; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; } .check-btn.done { background: #27ae60; border-color: #27ae60; } .check-btn.done::after { content: '✓'; color: white; font-size: 13px; font-weight: bold; } .check-btn:hover { border-color: #27ae60; transform: scale(1.1); } .water-btn { background: #1a2a3a; border: 1px solid #2a4a6a; color: #7fb3d3; padding: 6px 12px; border-radius: 3px; cursor: pointer; font-family: 'Bebas Neue', serif; font-size: 13px; letter-spacing: 1px; transition: all 0.15s; } .water-btn:hover { background: #2471A3; color: white; border-color: #2471A3; } .flex-dot { width: 24px; height: 24px; border-radius: 50%; border: 2px solid #333; cursor: pointer; transition: all 0.2s; } .flex-dot:hover { transform: scale(1.2); } .card { background: #161b22; border: 1px solid #21262d; border-radius: 6px; padding: 20px; margin-bottom: 16px; } .progress-bar-bg { background: #21262d; border-radius: 10px; height: 8px; overflow: hidden; } .progress-bar-fill { height: 100%; border-radius: 10px; transition: width 0.5s ease; } .day-pill { padding: 5px 10px; border-radius: 3px; font-family: 'Bebas Neue', serif; font-size: 13px; letter-spacing: 1px; cursor: pointer; border: 1px solid transparent; transition: all 0.15s; } .day-pill:hover { transform: translateY(-1px); } textarea { background: #0d1117; border: 1px solid #21262d; color: #ccc; font-family: 'Crimson Pro', serif; font-size: 15px; padding: 10px; border-radius: 4px; resize: vertical; width: 100%; transition: border-color 0.2s; } textarea:focus { outline: none; border-color: #e74c3c; } input[type=number] { background: #0d1117; border: 1px solid #21262d; color: #f0f0f0; font-family: 'Bebas Neue', serif; font-size: 20px; padding: 8px 12px; border-radius: 4px; width: 100px; text-align: center; } input[type=number]:focus { outline: none; border-color: #e74c3c; } .stat-card { background: #161b22; border: 1px solid #21262d; border-radius: 6px; padding: 16px; text-align: center; } .history-dot { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Bebas Neue', serif; font-size: 11px; letter-spacing: 1px; flex-direction: column; }`}</style>

```
  {/* Header */}
  <div style={{ background: "linear-gradient(135deg, #0d1117 0%, #1a0a0a 50%, #0d1117 100%)", borderBottom: "2px solid #e74c3c", padding: "24px 20px 18px", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at 20% 50%, rgba(231,76,60,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(39,174,96,0.05) 0%, transparent 60%)" }} />
    <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: 38, letterSpacing: 6, color: "#f0f0f0", lineHeight: 1 }}>CHEER PERFORMANCE</div>
          <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: 14, letterSpacing: 8, color: "#e74c3c", marginTop: 2 }}>PROGRESS TRACKER</div>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: 36, color: "#e74c3c", lineHeight: 1 }}>{streak}</div>
            <div style={{ fontSize: 11, color: "#888", letterSpacing: 2, fontFamily: "'Bebas Neue', serif" }}>DAY STREAK</div>
          </div>
          <div style={{ width: 1, height: 40, background: "#21262d" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: 36, color: "#27ae60", lineHeight: 1 }}>{Object.keys(data.workouts).length}</div>
            <div style={{ fontSize: 11, color: "#888", letterSpacing: 2, fontFamily: "'Bebas Neue', serif" }}>SESSIONS</div>
          </div>
          {saving && <div style={{ fontSize: 11, color: "#27ae60", fontFamily: "'Bebas Neue', serif", letterSpacing: 2 }}>SAVED ✓</div>}
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 16, flexWrap: "wrap" }}>
        {["SUN","MON","TUE","WED","THU","FRI","SAT"].map((d, i) => {
          const dk = weekDays[i];
          const done = data.workouts[dk]?.completed?.length > 0;
          const isToday = dk === today;
          return (
            <div key={d} className="history-dot" style={{ background: done ? "#27ae60" : isToday ? "#1a2010" : "#161b22", border: isToday ? "2px solid #27ae60" : "2px solid #21262d", color: done ? "#fff" : isToday ? "#27ae60" : "#555", gap: 1 }}>
              <div style={{ fontSize: 9, letterSpacing: 1 }}>{d}</div>
              {done && <div style={{ fontSize: 8 }}>✓</div>}
            </div>
          );
        })}
      </div>
    </div>
  </div>

  {/* Tabs */}
  <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px 20px 0" }}>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {[["today","TODAY"],["workout","WORKOUT"],["nutrition","NUTRITION"],["flexibility","FLEXIBILITY"],["history","HISTORY"]].map(([id, label]) => (
        <button key={id} className={`tab-btn ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>{label}</button>
      ))}
    </div>
  </div>

  <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px 20px" }}>

    {/* TODAY */}
    {tab === "today" && (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
          {[
            { label: "MEALS", val: `${mealsDone}/${MEALS.length}`, pct: mealsDone/MEALS.length*100, color: "#e67e22" },
            { label: "SUPPLEMENTS", val: `${suppsDone}/${SUPPS.length}`, pct: suppsDone/SUPPS.length*100, color: "#8e44ad" },
            { label: "EXERCISES", val: exTotal ? `${exDone}/${exTotal}` : "—", pct: exTotal ? exDone/exTotal*100 : 0, color: "#e74c3c" },
            { label: "HYDRATION", val: `${(todayWater/1000).toFixed(1)}L`, pct: waterPct, color: "#2980b9" },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: 11, letterSpacing: 3, color: "#555", marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: 32, color: s.color, lineHeight: 1, marginBottom: 8 }}>{s.val}</div>
              <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: `${s.pct}%`, background: s.color }} /></div>
            </div>
          ))}
        </div>

        <div className="card">
          <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: 13, letterSpacing: 3, color: "#555", marginBottom: 12 }}>SELECT TODAY'S WORKOUT</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {DAYS.map(d => (
              <div key={d.id} className="day-pill"
                onClick={() => { const nd = {...data}; if (!nd.workouts[today]) nd.workouts[today] = { dayId: d.id, completed: [], notes: "" }; nd.workouts[today].dayId = d.id; save(nd); }}
                style={{ background: todayWorkout.dayId === d.id ? d.color : "#0d1117", border: `1px solid ${todayWorkout.dayId === d.id ? d.color : "#21262d"}`, color: todayWorkout.dayId === d.id ? "#fff" : "#888" }}>
                {d.icon} {d.label}
              </div>
            ))}
          </div>
          {todayWorkout.dayId && (
            <div style={{ marginTop: 12, padding: "10px 14px", background: "#0d1117", borderRadius: 4, borderLeft: `3px solid ${DAYS.find(d=>d.id===todayWorkout.dayId)?.color}` }}>
              <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: 13, letterSpacing: 2, color: "#888" }}>{DAYS.find(d=>d.id===todayWorkout.dayId)?.title}</div>
            </div>
          )}
        </div>

        <div className="card">
          <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: 13, letterSpacing: 3, color: "#555", marginBottom: 12 }}>BODYWEIGHT</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <input type="number" value={todayWeight} onChange={e => setWeight(e.target.value)} placeholder="—" />
            <span style={{ fontFamily: "'Bebas Neue', serif", color: "#555", letterSpacing: 2, fontSize: 14 }}>KG / LBS</span>
          </div>
        </div>

        <div className="card">
          <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: 13, letterSpacing: 3, color: "#555", marginBottom: 12 }}>TODAY'S NOTES & FEELINGS</div>
          <textarea rows={4} placeholder="How did you feel today? Any stunt breakthroughs, flexibility wins, or things to work on..." value={data.cheerNotes[today] || ""} onChange={e => setCheerNote(e.target.value)} />
        </div>
      </div>
    )}

    {/* WORKOUT */}
    {tab === "workout" && (
      <div>
        {!todayWorkout.dayId ? (
          <div className="card" style={{ textAlign: "center", padding: 40 }}>
            <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: 20, letterSpacing: 4, color: "#555", marginBottom: 8 }}>NO WORKOUT SELECTED</div>
            <div style={{ color: "#555", fontSize: 14, fontFamily: "'Crimson Pro', serif" }}>Go to Today tab and select your workout day</div>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 6, height: 40, background: DAYS.find(d=>d.id===todayWorkout.dayId)?.color, borderRadius: 3 }} />
              <div>
                <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: 22, letterSpacing: 4 }}>{DAYS.find(d=>d.id===todayWorkout.dayId)?.label}</div>
                <div style={{ fontFamily: "'Crimson Pro', serif", color: "#888", fontSize: 14 }}>{DAYS.find(d=>d.id===todayWorkout.dayId)?.title}</div>
              </div>
              <div style={{ marginLeft: "auto", fontFamily: "'Bebas Neue', serif", fontSize: 28, color: DAYS.find(d=>d.id===todayWorkout.dayId)?.color }}>
                {todayWorkout.completed.length}/{EXERCISES[todayWorkout.dayId]?.length}
              </div>
            </div>
            <div className="progress-bar-bg" style={{ marginBottom: 20 }}>
              <div className="progress-bar-fill" style={{ width: `${EXERCISES[todayWorkout.dayId]?.length ? todayWorkout.completed.length/EXERCISES[todayWorkout.dayId].length*100 : 0}%`, background: DAYS.find(d=>d.id===todayWorkout.dayId)?.color }} />
            </div>
            <div className="card">
              {EXERCISES[todayWorkout.dayId]?.map((ex, i) => {
                const done = todayWorkout.completed.includes(ex);
                return (
                  <div key={ex} onClick={() => toggleExercise(todayWorkout.dayId, ex)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < EXERCISES[todayWorkout.dayId].length - 1 ? "1px solid #21262d" : "none", cursor: "pointer", opacity: done ? 0.6 : 1 }}>
                    <button className={`check-btn ${done ? "done" : ""}`} />
                    <span style={{ fontFamily: "'Crimson Pro', serif", fontSize: 17, textDecoration: done ? "line-through" : "none", color: done ? "#555" : "#f0f0f0" }}>{ex}</span>
                  </div>
                );
              })}
            </div>
            <div className="card">
              <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: 13, letterSpacing: 3, color: "#555", marginBottom: 10 }}>WORKOUT NOTES / PRS</div>
              <textarea rows={4} placeholder="Notes, weights used, personal records, how it felt..." value={todayWorkout.notes || ""} onChange={e => setWorkoutNote(e.target.value)} />
            </div>
          </>
        )}
        <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: 13, letterSpacing: 3, color: "#555", marginBottom: 12, marginTop: 8 }}>WEEKLY PROGRAM OVERVIEW</div>
        {DAYS.map(d => (
          <div key={d.id} className="card" style={{ borderLeft: `3px solid ${d.color}`, marginBottom: 10, padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 18 }}>{d.icon}</span>
              <span style={{ fontFamily: "'Bebas Neue', serif", fontSize: 15, letterSpacing: 2 }}>{d.label}</span>
              <span style={{ fontFamily: "'Crimson Pro', serif", color: "#888", fontSize: 13 }}>— {d.title}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {EXERCISES[d.id].map(ex => (
                <span key={ex} style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 3, padding: "2px 8px", fontSize: 12, fontFamily: "'Crimson Pro', serif", color: "#888" }}>{ex}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    )}

    {/* NUTRITION */}
    {tab === "nutrition" && (
      <div>
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: 16, letterSpacing: 3, color: "#2980b9" }}>💧 HYDRATION</div>
            <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: 28, color: "#2980b9" }}>{(todayWater/1000).toFixed(2)}L</div>
          </div>
          <div className="progress-bar-bg" style={{ marginBottom: 12 }}>
            <div className="progress-bar-fill" style={{ width: `${waterPct}%`, background: "linear-gradient(90deg, #2980b9, #5dade2)" }} />
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[250, 500, 750, 1000].map(ml => (
              <button key={ml} className="water-btn" onClick={() => setWater(todayWater + ml)}>+{ml}ml</button>
            ))}
            <button className="water-btn" style={{ borderColor: "#e74c3c", color: "#e74c3c" }} onClick={() => setWater(0)}>RESET</button>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            {[1500,2000,2500,3000,3500,4000,4500].map(ml => (
              <div key={ml} style={{ flex: 1, height: 32, borderRadius: 3, background: todayWater >= ml ? "#2980b9" : "#21262d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontFamily: "'Bebas Neue', serif", color: todayWater >= ml ? "#fff" : "#444", letterSpacing: 0.5 }}>{ml/1000}L</div>
            ))}
          </div>
        </div>

        <div className="card">
          <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: 16, letterSpacing: 3, color: "#e67e22", marginBottom: 14 }}>🍽️ MEALS — {mealsDone}/{MEALS.length}</div>
          <div className="progress-bar-bg" style={{ marginBottom: 14 }}>
            <div className="progress-bar-fill" style={{ width: `${mealsDone/MEALS.length*100}%`, background: "#e67e22" }} />
          </div>
          {MEALS.map((meal, i) => {
            const done = !!todayMeals[meal];
            return (
              <div key={meal} onClick={() => toggleMeal(meal)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: i < MEALS.length - 1 ? "1px solid #21262d" : "none", cursor: "pointer" }}>
                <button className={`check-btn ${done ? "done" : ""}`} />
                <span style={{ fontFamily: "'Crimson Pro', serif", fontSize: 17, color: done ? "#555" : "#f0f0f0", textDecoration: done ? "line-through" : "none" }}>{meal}</span>
                {["Breakfast","Pre-Workout"].includes(meal) && <span style={{ fontSize: 10, fontFamily: "'Bebas Neue', serif", letterSpacing: 1, color: "#e67e22", marginLeft: "auto" }}>KEY</span>}
              </div>
            );
          })}
        </div>

        <div className="card">
          <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: 16, letterSpacing: 3, color: "#8e44ad", marginBottom: 14 }}>💊 SUPPLEMENTS — {suppsDone}/{SUPPS.length}</div>
          <div className="progress-bar-bg" style={{ marginBottom: 14 }}>
            <div className="progress-bar-fill" style={{ width: `${suppsDone/SUPPS.length*100}%`, background: "#8e44ad" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
            {SUPPS.map(s => {
              const done = !!todaySupps[s];
              return (
                <div key={s} onClick={() => toggleSupp(s)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 4, background: done ? "#2d1a42" : "#0d1117", border: `1px solid ${done ? "#8e44ad" : "#21262d"}`, cursor: "pointer", transition: "all 0.2s" }}>
                  <button className={`check-btn ${done ? "done" : ""}`} style={{ width: 22, height: 22, background: done ? "#8e44ad" : "transparent", borderColor: done ? "#8e44ad" : "#333" }} />
                  <span style={{ fontFamily: "'Crimson Pro', serif", fontSize: 15, color: done ? "#c39bd3" : "#888" }}>{s}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    )}

    {/* FLEXIBILITY */}
    {tab === "flexibility" && (
      <div>
        <div style={{ fontFamily: "'Crimson Pro', serif", color: "#888", fontSize: 15, marginBottom: 16, fontStyle: "italic" }}>
          Rate your current level for each skill (1 = barely there → 5 = performance ready)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 12 }}>
          {FLEX_GOALS.map(g => {
            const flexItem = data.flex[g.id] || { level: 0 };
            const colors = ["#21262d","#e74c3c","#e67e22","#d4ac0d","#2980b9","#27ae60"];
            const labels = ["—","WORKING ON IT","GETTING THERE","ALMOST CLEAN","SOLID","PERFORMANCE READY"];
            return (
              <div key={g.id} className="card">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 22 }}>{g.icon}</span>
                    <span style={{ fontFamily: "'Bebas Neue', serif", fontSize: 16, letterSpacing: 2 }}>{g.label}</span>
                  </div>
                  <span style={{ fontFamily: "'Bebas Neue', serif", fontSize: 11, letterSpacing: 2, color: colors[flexItem.level] }}>{labels[flexItem.level]}</span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {[1,2,3,4,5].map(n => (
                    <div key={n} className="flex-dot"
                      onClick={() => setFlexLevel(g.id, flexItem.level === n ? 0 : n)}
                      style={{ background: n <= flexItem.level ? colors[flexItem.level] : "#0d1117", borderColor: n <= flexItem.level ? colors[flexItem.level] : "#333" }} />
                  ))}
                </div>
                {flexItem.date && <div style={{ marginTop: 8, fontSize: 11, color: "#555", fontFamily: "'Bebas Neue', serif", letterSpacing: 1 }}>LAST UPDATED: {flexItem.date}</div>}
              </div>
            );
          })}
        </div>

        <div className="card" style={{ marginTop: 8 }}>
          <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: 14, letterSpacing: 3, color: "#27ae60", marginBottom: 14 }}>TODAY'S STRETCH CHECKLIST</div>
          {[
            "Hamstrings — 3×45 sec each side",
            "Hip flexors — kneeling lunge 45 sec each",
            "Splits active hold — 60 sec each",
            "Shoulders — cross-body & overhead 30 sec",
            "Thoracic spine — cat-cow 10 reps",
            "Wrists — flexor/extensor 30 sec each",
            "Ankles — circles 30 sec each direction",
          ].map((stretch, i) => {
            const key = `stretch-${today}-${i}`;
            const done = !!data.supps[key];
            return (
              <div key={i} onClick={() => { const nd={...data}; if(!nd.supps[key]) nd.supps[key]=true; else delete nd.supps[key]; save(nd); }}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 6 ? "1px solid #21262d" : "none", cursor: "pointer", opacity: done ? 0.5 : 1 }}>
                <button className={`check-btn ${done ? "done" : ""}`} style={{ borderColor: done ? "#27ae60" : "#333", background: done ? "#27ae60" : "transparent" }} />
                <span style={{ fontFamily: "'Crimson Pro', serif", fontSize: 16, textDecoration: done ? "line-through" : "none", color: done ? "#555" : "#f0f0f0" }}>{stretch}</span>
              </div>
            );
          })}
        </div>
      </div>
    )}

    {/* HISTORY */}
    {tab === "history" && (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
          {[
            { label: "TOTAL SESSIONS", val: Object.keys(data.workouts).length, color: "#e74c3c" },
            { label: "MEALS TRACKED", val: Object.values(data.meals).reduce((a, m) => a + Object.values(m).filter(Boolean).length, 0), color: "#e67e22" },
            { label: "SUPPS TRACKED", val: Object.values(data.supps).filter(v => typeof v === "object" && v !== null).reduce((a, s) => a + Object.values(s).filter(Boolean).length, 0), color: "#8e44ad" },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: 10, letterSpacing: 2, color: "#555", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: 40, color: s.color, lineHeight: 1 }}>{s.val}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: 14, letterSpacing: 3, color: "#27ae60", marginBottom: 14 }}>FLEXIBILITY PROGRESS OVERVIEW</div>
          {FLEX_GOALS.map(g => {
            const flexItem = data.flex[g.id] || { level: 0 };
            const colors = ["#21262d","#e74c3c","#e67e22","#d4ac0d","#2980b9","#27ae60"];
            return (
              <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 110, fontFamily: "'Bebas Neue', serif", fontSize: 12, letterSpacing: 1, color: "#888" }}>{g.icon} {g.label}</div>
                <div style={{ flex: 1, display: "flex", gap: 3 }}>
                  {[1,2,3,4,5].map(n => (
                    <div key={n} style={{ flex: 1, height: 12, borderRadius: 2, background: n <= flexItem.level ? colors[flexItem.level] : "#21262d", transition: "all 0.3s" }} />
                  ))}
                </div>
                <div style={{ width: 30, fontFamily: "'Bebas Neue', serif", fontSize: 16, color: colors[flexItem.level], textAlign: "right" }}>{flexItem.level}/5</div>
              </div>
            );
          })}
        </div>

        <div className="card">
          <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: 14, letterSpacing: 3, color: "#555", marginBottom: 14 }}>RECENT SESSIONS</div>
          {Object.entries(data.workouts).sort((a,b) => b[0].localeCompare(a[0])).slice(0, 14).length === 0 ? (
            <div style={{ color: "#555", fontFamily: "'Crimson Pro', serif", fontSize: 15, textAlign: "center", padding: 20 }}>No sessions logged yet. Start training!</div>
          ) : Object.entries(data.workouts).sort((a,b) => b[0].localeCompare(a[0])).slice(0, 14).map(([date, w]) => {
            const day = DAYS.find(d => d.id === w.dayId);
            const tot = w.dayId ? EXERCISES[w.dayId]?.length || 0 : 0;
            const pct = tot ? Math.round(w.completed.length/tot*100) : 0;
            return (
              <div key={date} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #21262d" }}>
                <div style={{ width: 90, fontFamily: "'Bebas Neue', serif", fontSize: 13, color: "#555", letterSpacing: 1 }}>{date}</div>
                <div style={{ width: 6, height: 32, background: day?.color || "#333", borderRadius: 3, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: 14, letterSpacing: 1 }}>{day ? `${day.label} — ${day.title}` : "Workout"}</div>
                  {w.notes && <div style={{ fontFamily: "'Crimson Pro', serif", fontSize: 13, color: "#555", fontStyle: "italic", marginTop: 2 }}>{w.notes.slice(0,60)}{w.notes.length > 60 ? "..." : ""}</div>}
                </div>
                <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: 20, color: pct === 100 ? "#27ae60" : day?.color || "#888" }}>{pct}%</div>
              </div>
            );
          })}
        </div>

        {Object.keys(data.weight).length > 0 && (
          <div className="card" style={{ marginTop: 16 }}>
            <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: 14, letterSpacing: 3, color: "#555", marginBottom: 14 }}>WEIGHT LOG</div>
            {Object.entries(data.weight).sort((a,b) => b[0].localeCompare(a[0])).slice(0, 10).map(([date, w]) => (
              <div key={date} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #21262d" }}>
                <span style={{ fontFamily: "'Bebas Neue', serif", fontSize: 13, color: "#555", letterSpacing: 1 }}>{date}</span>
                <span style={{ fontFamily: "'Bebas Neue', serif", fontSize: 20, color: "#d4ac0d" }}>{w}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
</div>
```

);
}
