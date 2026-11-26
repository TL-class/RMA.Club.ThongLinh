document.getElementById("quizBtn").addEventListener("click", () => {
  const q1 = document.querySelector('input[name="q1"]:checked');
  const q2 = document.querySelector('input[name="q2"]:checked');
  const q3 = document.querySelector('input[name="q3"]:checked');
  
  let score = 0;
  
  // Reset trạng thái
  document.querySelectorAll('.question').forEach(el => {
    el.classList.remove('correct', 'incorrect');
  });

  // Kiểm tra q1
  if (q1) {
    if (q1.value === "a") { 
        score++; 
        document.getElementById('question1').classList.add('correct'); 
    } else { 
        document.getElementById('question1').classList.add('incorrect'); 
    }
  }
  
  // Kiểm tra q2
  if (q2) {
    if (q2.value === "a") { 
        score++; 
        document.getElementById('question2').classList.add('correct'); 
    } else { 
        document.getElementById('question2').classList.add('incorrect'); 
    }
  }
  
  // Kiểm tra q3
  if (q3) {
    if (q3.value === "b") { 
        score++; 
        document.getElementById('question3').classList.add('correct'); 
    } else { 
        document.getElementById('question3').classList.add('incorrect'); 
    }
  }
  
  const resultEl = document.getElementById("result");
  if (q1 && q2 && q3) {
      resultEl.textContent = `Hoàn thành! Bạn trả lời đúng ${score}/3 câu.`;
      resultEl.style.color = score === 3 ? "#27ae60" : "#e67e22";
  } else {
      resultEl.textContent = `Vui lòng trả lời tất cả các câu hỏi trước khi chấm điểm. (Hiện tại đúng ${score} câu)`;
      resultEl.style.color = "#c0392b";
  }
  resultEl.className = "quiz-result";
});