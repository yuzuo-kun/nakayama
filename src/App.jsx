import { useEffect, useState } from 'react'
import './App.css'

function App() {
  // 基準となる食材
  const baseFoods = [
    { id: 1, name: "コーチンもも", QPK: 50, unit: "Kg", min: 0.5 },
    { id: 2, name: "コーチンレバー", QPK: 30, unit: "Kg", min: 0.5 },
    { id: 3, name: "コーチンせせり", QPK: 30, unit: "Kg", min: 0.5 },
    { id: 4, name: "恵那もも", QPK: 50, unit: "Kg", min: 0.5 },
    { id: 5, name: "恵那むね", QPK: 50, unit: "Kg", min: 0.5 },
    { id: 6, name: "奥三河もも", QPK: 50, unit: "Kg", min: 0.5 },
    { id: 7, name: "ブラジル産せせり", QPK: 60, unit: "pc", min: 1 },
    { id: 8, name: "国産ハツ", QPK: 50, unit: "Kg", min: 0.5 },
    { id: 9, name: "手羽先", QPK: 15, unit: "Kg", min: 0.5 }
  ]

  // foods初期化or取得関数
  const initFoods = () => {
    const storageFoods = localStorage.getItem("nakayama-foods");
    if(storageFoods) {
      return JSON.parse(storageFoods);
    } else {
      localStorage.setItem("nakayama-foods", JSON.stringify(baseFoods));
      return baseFoods;
    }
  };

  const course = [
    { id: 1, name: "コーチンしゃぶ" },
    { id: 2, name: "コーチン鉄板" },
    { id: 3, name: "恵那しゃぶ" },
    { id: 4, name: "恵那鉄板" }
  ];

  const course_food = [
    { course_id: 1, food_id: 1, quantity: 2 },
    { course_id: 1, food_id: 2, quantity: 2 },
    { course_id: 1, food_id: 3, quantity: 2 },
    { course_id: 2, food_id: 1, quantity: 3 },
    { course_id: 2, food_id: 2, quantity: 3 },
    { course_id: 2, food_id: 3, quantity: 3 },
    { course_id: 3, food_id: 4, quantity: 2 },
    { course_id: 3, food_id: 5, quantity: 2 },
    { course_id: 4, food_id: 4, quantity: 3 },
    { course_id: 4, food_id: 7, quantity: 3 },
    { course_id: 4, food_id: 8, quantity: 3 }
  ];

  const [foods, setFoods] = useState(initFoods());
  
  useEffect(() => {
    localStorage.setItem("nakayama-foods", JSON.stringify(foods));
  }, [foods]);

  const [courseCount, setCourseCount] = useState(Array(course.length).fill(0));
  const [foodCount, setFoodCount] = useState(Array(foods.length).fill(0));

  // コース数が変わった時の処理
  const handleCourseCountChange = (index, num) => {
    const value = Math.max(0, Number(courseCount[index] + num)); // 0未満にならないよう補正
    const newCourseCount = [...courseCount];
    newCourseCount[index] = value;
    setCourseCount(newCourseCount);
  };

  // 食材数が変わった時の処理
  const handleFoodCountChange = (index, num) => {
    const value = Math.max(0, Number(foodCount[index] + num)); // 0未満にならないよう補正
    const newFoodCount = [...foodCount];
    newFoodCount[index] = value;
    setFoodCount(newFoodCount);
  };

  // 発注数を返す関数
  const getOrderCount = (foodId) => {
    let orderCount = 0;
    if (foodId === 6) { // 奥三河もも
      orderCount = courseCount.reduce((sum, cnt) => sum + (3 * cnt), 0);
    } else if (foodId === 9) { // 手羽先
      orderCount = (courseCount[1] + courseCount[3]) * 2;
    } else {
      orderCount = course_food.filter(item => item.food_id === foodId)
        .reduce((sum, item) => sum + (courseCount[item.course_id - 1] * item.quantity), 0);
    }
    const dif = orderCount - foodCount[foodId - 1];
    if (dif < 0) return 0
    return Math.ceil(dif / foods[foodId - 1].QPK / foods[foodId - 1].min) * foods[foodId - 1].min;
    // return dif;
  }

  // 設定用toggle
  const [settingToggle, setSettingToggle] = useState(false);

  // QPK変更時のアクション
  const handleChangeQPK = (e, i) => {
    const newFoods = [...foods];
    newFoods[i] = { ...newFoods[i], QPK: e.target.value }
    setFoods(newFoods);
  };

  return (
    <>
      <h1>
        <img src='/nakayama/nakayama.png' alt='なか山のロゴ' />
        肉発注サポート
      </h1>
      <h2>入力</h2>
      {course.map((c, i) => (
        <p className='row' key={c.id}>
          <span className='name-cell'>{c.name}</span>
          <span className='culc-btn down' onClick={() => handleCourseCountChange(i, -10)}>10</span>
          <span className='culc-btn down' onClick={() => handleCourseCountChange(i, -1)}>1</span>
          <span className='number-cell'>
            {`${courseCount[i]} 人`}
          </span>
          <span className='culc-btn up' onClick={() => handleCourseCountChange(i, 1)}>1</span>
          <span className='culc-btn up' onClick={() => handleCourseCountChange(i, 10)}>10</span>
        </p>
      ))}
      <h2>発注数</h2>
      {foods.map((f, i) => (
        <p className='row order' key={f.id}>
          <span>
            <span className='name-cell'>{f.name}</span>
            <span className='culc-btn down' onClick={() => handleFoodCountChange(i, -10)}>10</span>
            <span className='culc-btn down' onClick={() => handleFoodCountChange(i, -1)}>1</span>
            <span className='number-cell'>
              {`${foodCount[i]} 個`}
            </span>
            <span className='culc-btn up' onClick={() => handleFoodCountChange(i, 1)}>1</span>
            <span className='culc-btn up' onClick={() => handleFoodCountChange(i, 10)}>10</span>
          </span>
          <span>{`${getOrderCount(f.id)}${f.unit}`}</span>
        </p>
      ))}
      <h2 className='clickable' onClick={() => setSettingToggle(!settingToggle)}>設定 {settingToggle ? "△" : "▼"}</h2>
      <div className={`setting-box ${settingToggle ? "" : "hidden"}`}>
        {foods.map((f, i) => (
          <p className='row' key={f.id}>
            <span>
              <span className='name-cell'>{f.name}</span>
              <span className='number-cell'>
                <input
                  className='no-border'
                  type='number'
                  value={f.QPK}
                  min={1}
                  onChange={(e) => handleChangeQPK(e, i)}
                />
                個
              </span>
            </span>
            <span>{`/${f.unit}`}</span>
          </p>
        ))}
      </div>
    </>
  )
}

export default App
