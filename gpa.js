GRADE = { "AA": 4.0, "A": 3.0, "B": 2.0, "C": 1.0, "D": 0.0 }

function calc() {
    lines = document.getElementById("textbox").value

    grades = []
    lines.split("\n").forEach(line => {
        splited = line.split(/\s+/)
        _out = ""
        splited.forEach(ele => _out += ele + ",")
        console.log(_out + "\n")
        let [semester, year, grade, credit] = [splited.pop(), splited.pop(), splited.pop(), splited.pop()]
        console.log(credit + "," + grade + "," + year + "," + semester + ",")
        if (credit && grade && year && semester) {
            grades.push([credit, grade, year, semester])
        }
    });

    raw_gpa = 0.0
    weighted_gpa = 0.0
    cred = 0.0
    semester_gpa = {}
    semester_cred = {}

    creds = { "AA": 0.0, "A": 0.0, "B": 0.0, "C": 0.0, "D": 0.0 }
    function h2z(str) {
        return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        });
    }
    grades.forEach(element => {

        let [credit, grade, year, semester] = element;

        console.log(element.length + credit + grade + year + semester + "です\n")
        credit = h2z(credit)
        grade = h2z(grade)
        if (!isNaN(grade)) {
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
        cred += credit
        semester_cred[sem] += credit
        creds[grade] += credit
    });
    if (!cred)
        alert("取得された単位数が0")
    
    let cur_sem = Object.keys(semester_cred).pop()
    let gpa = Math.round(weighted_gpa / cred * 100)/100
    document.getElementById("gpa-num").textContent = `${gpa}\n`

    document.getElementById("tweetBtn").href = `https://twitter.com/intent/tweet?text="今セメのGPAは${gpa}でした！https://kuramot6f.github.io/online-gpa-calculator?gpa=${gpa}"`

    out = `総取得単位数：${cred}\n`
    Object.keys(semester_gpa).forEach(sem => out += `${sem}：${Math.round(semester_gpa[sem] / semester_cred[sem]*100)/100}\n`)
    Object.keys(creds).forEach(grade => out += `${grade}：${creds[grade]}単位\n`)
    document.getElementById("details").innerHTML = out.replace(/\r?\n/g, '<br>')
    document.getElementById("resultBox").style.display = "block"
}

var result = true
function comboDetail() {
    result = !result
    document.getElementById("comboLabel").innerHTML = result ? `<img id="comboArrow" src="./down.svg" />もっと見る` : `<img id="comboArrow" src="./up.svg" />隠す`
    document.getElementById("detailBox").style.display = result ? "none" : "block"
    document.getElementById("resultFg").style.height = result ? "400px" : "600px"
}

function closeResult() {
    document.getElementById("resultBox").style.display = "none"
}