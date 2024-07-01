export class Tutorial {
  constructor() {
    this.currentStep = 0
    this.steps = [
      { title: '30309-김현민', description: '수행평가 과제' },
      { title: '게임 설명', description: '과일이 같은 과일과 충돌하면 <br> 더 큰 과일로 합쳐집니다.' },
      { title: '게임 설명', description: '과일이 화면 위로 올라가면 게임 오버입니다.' },
      { title: '종료', description: '닫기 버튼을 눌러 종료하세요.' },
    ]

    this.modal = document.getElementById('tutorial-modal')
    this.tutorialContent = document.getElementById('tutorial-content')
    this.prevButton = document.getElementById('prev-button')
    this.nextButton = document.getElementById('next-button')
    this.closeButton = document.getElementById('close-button')

    this.prevButton.addEventListener('click', () => this.prevStep())
    this.nextButton.addEventListener('click', () => this.nextStep())
    this.closeButton.addEventListener('click', () => this.closeTutorial())
  }

  isTutorialCompleted() {
    return localStorage.getItem('tutorialCompleted') === 'true'
  }

  showTutorial() {
    this.modal.style.display = 'flex'
    this.showStep()
  }

  showStep() {
    const step = this.steps[this.currentStep]
    this.tutorialContent.innerHTML = `<h2>${step.title}</h2><p>${step.description}</p>`
    this.prevButton.style.display = this.currentStep === 0 ? 'none' : 'inline-block'
    this.nextButton.style.display = this.currentStep === this.steps.length - 1 ? 'none' : 'inline-block'
    this.closeButton.style.display = this.currentStep === this.steps.length - 1 ? 'inline-block' : 'none'
    this.prevButton.disabled = this.currentStep === 0
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--
      this.showStep()
    }
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++
      this.showStep()
    }
  }

  closeTutorial() {
    localStorage.setItem('tutorialCompleted', 'true')
    this.modal.style.display = 'none'
  }
}
