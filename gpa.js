//ほとんどフォーク元のpythonコードをjsにポートしただけ
//TO DO:あんまjsっぽくないコードなので書き直してもいいかも
const GRADE = { "AA": 4.0, "A": 3.0, "B": 2.0, "C": 1.0, "D": 0.0 }

function calc() {
    //適当に解析
    const lines = document.getElementById("textbox").value
    let grades = []
    lines.split("\n").forEach(line => {
        splited = line.split(/\s+/)
        const [semester, year, grade, credit] = [splited.pop(), splited.pop(), splited.pop(), splited.pop()]
        if (credit && grade && year && semester) { //妥当な行のみ成績リストに追加
            //成績が出ていない科目は除外
            if(grade.match(/^[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+$/)) {
                return;
            }
            //最後の成績合計を除外
            if(!semester.match(/^[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+$/)) {
                return;
            }
            grades.push([credit, grade, year, semester])
        }
    });

    let raw_gpa = 0.0
    let weighted_gpa = 0.0
    let cred = 0.0
    let semester_gpa = {}
    let semester_cred = {}
    let creds = { "AA": 0.0, "A": 0.0, "B": 0.0, "C": 0.0, "D": 0.0 }

    function h2z(str) { //全角カタカナを半角カタカナに変換
        return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        });
    }
    grades.forEach(element => {
        let [credit, grade, year, semester] = element;

        console.log(element.length + credit + grade + year + semester + "です\n")
        credit = h2z(credit)
        grade = h2z(grade)
        if (!isNaN(grade)) { //数値の成績(そんなのあるのか？)を変換
            int_grade = Number(grade)
            if (90 <= int_grade && int_grade <= 100)
                grade = "AA"
            else if (80 <= int_grade && int_grade < 90)
                grade = "A"
            else if (70 <= int_grade && int_grade < 80)
                grade = "B"
            else if (60 <= int_grade && int_grade < 70)
                grade = "C"
            else
                grade = "D"
        }
        if (grade in GRADE === false) return;

        if (semester.startsWith("前期")) {
            semester = "前期"
        } else if (semester.startsWith("後期")) {
            semester = "後期"
        } else {
            semester = "他"
        }

        sem = year + " " + semester
        if (sem in semester_gpa === false) {
            semester_gpa[sem] = semester_cred[sem] = 0
        }

        credit = Number(credit)
        raw_gpa += GRADE[grade]
        weighted_gpa += GRADE[grade] * credit
        semester_gpa[sem] += GRADE[grade] * credit
        cred += credit;
        console.log(cred);
        semester_cred[sem] += credit
        creds[grade] += credit
    });
    if (!cred)
        alert("入力間違いしてるよ！！")
    
    let cur_sem = Object.keys(semester_cred).pop()
    let gpa = Math.round(weighted_gpa / cred * 100)/100
    let cur_gpa = Math.round(semester_gpa["2023 前期"] / semester_cred["2023 前期"]*100)/100
    document.getElementById("gpa-num").textContent = `${cur_gpa}\n`

    document.getElementById("tweetBtn").href = `https://twitter.com/intent/tweet?text=今セメのGPAは${cur_gpa}でした！https://kuramot6f.github.io/online-gpa-calculator`

    out = `総取得単位数：${cred}\n`
    out += `全体のGPA平均:${gpa}\n`
    Object.keys(semester_gpa).forEach(sem => out += `${sem}：${Math.round(semester_gpa[sem] / semester_cred[sem]*100)/100}\n`)
    //Object.keys(creds).forEach(grade => out += `${grade}：${creds[grade]}単位\n`)
    document.getElementById("details").innerHTML = out.replace(/\r?\n/g, '<br>')
    document.getElementById("resultBox").style.display = "block"
}

let result = true
function comboDetail() {
    result = !result
    document.getElementById("comboLabel").innerHTML = result ? `<img id="comboArrow" src="./down.svg" />もっと見る` : `<img id="comboArrow" src="./up.svg" />隠す`
    document.getElementById("detailBox").style.display = result ? "none" : "block"
    document.getElementById("resultFg").style.height = result ? "400px" : "600px"
}

function closeResult() {
    document.getElementById("resultBox").style.display = "none"
}
