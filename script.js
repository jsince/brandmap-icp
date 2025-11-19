// ICP Definition Form - Multi-Step Form Logic
class ICPForm {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 7;
    this.formData = this.loadFromLocalStorage() || {};
    
    this.init();
  }

  init() {
    this.renderProgressSteps();
    this.updateProgress();
    this.attachEventListeners();
    this.loadFormData();
  }

  renderProgressSteps() {
    const progressSteps = document.getElementById('progressSteps');
    const steps = [
      'Company',
      'Business',
      'Pain Points',
      'Goals',
      'Decision',
      'Budget',
      'Review'
    ];

    progressSteps.innerHTML = steps.map((step, index) => 
      `<div class="progress-step ${index + 1 === this.currentStep ? 'active' : ''} ${index + 1 < this.currentStep ? 'completed' : ''}" data-step="${index + 1}">
        ${index + 1}. ${step}
      </div>`
    ).join('');
  }

  attachEventListeners() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const exportBtn = document.getElementById('exportBtn');

    prevBtn.addEventListener('click', () => this.previousStep());
    nextBtn.addEventListener('click', () => this.nextStep());
    exportBtn.addEventListener('click', () => this.exportData());

    // Auto-save on input change
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('change', () => this.saveFormData());
      input.addEventListener('input', () => this.saveFormData());
    });

    // Click on progress steps to navigate
    document.querySelectorAll('.progress-step').forEach(step => {
      step.addEventListener('click', (e) => {
        const stepNum = parseInt(e.target.dataset.step);
        if (stepNum < this.currentStep) {
          this.goToStep(stepNum);
        }
      });
    });
  }

  validateStep() {
    const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
    const inputs = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
    
    let isValid = true;
    inputs.forEach(input => {
      const formGroup = input.closest('.form-group');
      
      // Remove previous error
      formGroup.classList.remove('error');
      const existingError = formGroup.querySelector('.error-message');
      if (existingError) {
        existingError.remove();
      }

      // Check if empty
      if (!input.value.trim()) {
        isValid = false;
        formGroup.classList.add('error');
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'This field is required';
        formGroup.appendChild(errorMsg);
      }
    });

    return isValid;
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      // Validate current step before proceeding
      if (!this.validateStep()) {
        return;
      }

      this.saveFormData();
      this.currentStep++;
      
      if (this.currentStep === this.totalSteps) {
        this.generateSummary();
      }
      
      this.updateProgress();
      this.showCurrentStep();
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateProgress();
      this.showCurrentStep();
    }
  }

  goToStep(stepNum) {
    if (stepNum >= 1 && stepNum <= this.totalSteps && stepNum < this.currentStep) {
      this.currentStep = stepNum;
      this.updateProgress();
      this.showCurrentStep();
    }
  }

  showCurrentStep() {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(step => {
      step.classList.remove('active');
    });

    // Show current step
    const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
    currentStepElement.classList.add('active');

    // Update navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.style.display = this.currentStep === 1 ? 'none' : 'block';
    nextBtn.textContent = this.currentStep === this.totalSteps ? 'Complete' : 'Next Step';

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const percentage = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
    progressFill.style.width = `${percentage}%`;

    // Update progress step indicators
    document.querySelectorAll('.progress-step').forEach((step, index) => {
      step.classList.remove('active', 'completed');
      
      if (index + 1 === this.currentStep) {
        step.classList.add('active');
      } else if (index + 1 < this.currentStep) {
        step.classList.add('completed');
      }
    });

    // Show export button only on last step
    const exportBtn = document.getElementById('exportBtn');
    exportBtn.style.display = this.currentStep === this.totalSteps ? 'block' : 'none';
  }

  saveFormData() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (input.name) {
        this.formData[input.name] = input.value;
      }
    });

    this.saveToLocalStorage();
  }

  loadFormData() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (input.name && this.formData[input.name]) {
        input.value = this.formData[input.name];
      }
    });
  }

  saveToLocalStorage() {
    localStorage.setItem('icpFormData', JSON.stringify(this.formData));
  }

  loadFromLocalStorage() {
    const data = localStorage.getItem('icpFormData');
    return data ? JSON.parse(data) : null;
  }

  generateSummary() {
    const summaryContent = document.getElementById('summaryContent');
    
    const sections = [
      {
        title: 'Company Profile',
        fields: [
          { label: 'Company Size', key: 'companySize' },
          { label: 'Industry', key: 'industry' },
          { label: 'Annual Revenue', key: 'revenue' },
          { label: 'Location', key: 'location' }
        ]
      },
      {
        title: 'Business Model',
        fields: [
          { label: 'Business Type', key: 'businessType' },
          { label: 'Target Market', key: 'targetMarket' },
          { label: 'Maturity Stage', key: 'maturityStage' },
          { label: 'Technology Stack', key: 'techStack' }
        ]
      },
      {
        title: 'Pain Points & Challenges',
        fields: [
          { label: 'Primary Pain Point', key: 'primaryPain' },
          { label: 'Secondary Pain Points', key: 'secondaryPain' },
          { label: 'Current Solution', key: 'currentSolution' },
          { label: 'Pain Severity', key: 'painSeverity' }
        ]
      },
      {
        title: 'Goals & Objectives',
        fields: [
          { label: 'Primary Goal', key: 'primaryGoal' },
          { label: 'Success Metrics', key: 'successMetrics' },
          { label: 'Desired Outcome', key: 'desiredOutcome' },
          { label: 'Timeline', key: 'timeline' }
        ]
      },
      {
        title: 'Decision Making',
        fields: [
          { label: 'Decision Maker', key: 'decisionMaker' },
          { label: 'Influencers', key: 'influencers' },
          { label: 'Committee Size', key: 'buyingCommittee' },
          { label: 'Decision Criteria', key: 'decisionCriteria' },
          { label: 'Sales Cycle', key: 'salesCycle' }
        ]
      },
      {
        title: 'Budget & Readiness',
        fields: [
          { label: 'Budget Range', key: 'budgetRange' },
          { label: 'Budget Approval', key: 'budgetApproval' },
          { label: 'Purchase Timeframe', key: 'purchaseTimeframe' },
          { label: 'Competitor Usage', key: 'competitorUsage' },
          { label: 'Switching Barriers', key: 'switchingBarriers' }
        ]
      }
    ];

    summaryContent.innerHTML = sections.map(section => `
      <div class="summary-section">
        <h3>${section.title}</h3>
        ${section.fields.map(field => `
          <div class="summary-item">
            <div class="summary-label">${field.label}</div>
            <div class="summary-value">${this.formData[field.key] || 'Not provided'}</div>
          </div>
        `).join('')}
      </div>
    `).join('');
  }

  exportData() {
    const dataStr = JSON.stringify(this.formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `icp-definition-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show success message
    const summaryContent = document.getElementById('summaryContent');
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.textContent = '✓ ICP definition exported successfully!';
    summaryContent.insertBefore(successMsg, summaryContent.firstChild);

    setTimeout(() => {
      successMsg.remove();
    }, 3000);
  }
}

// Initialize the form when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ICPForm();
});

