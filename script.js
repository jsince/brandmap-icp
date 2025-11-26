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

// AI Chatbot
class Chatbot {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.attachedFiles = [];
    this.init();
  }

  init() {
    this.toggleBtn = document.getElementById('chatbotToggle');
    this.closeBtn = document.getElementById('chatbotClose');
    this.container = document.getElementById('chatbotContainer');
    this.window = document.getElementById('chatbotWindow');
    this.messagesContainer = document.getElementById('chatbotMessages');
    this.input = document.getElementById('chatbotInput');
    this.sendBtn = document.getElementById('chatbotSend');
    this.badge = document.getElementById('chatbotBadge');
    this.fileInput = document.getElementById('chatbotFileInput');
    this.attachmentsContainer = document.getElementById('chatbotAttachments');

    this.toggleBtn.addEventListener('click', () => this.toggle());
    this.closeBtn.addEventListener('click', () => this.close());
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Focus input when chatbot opens
    this.container.addEventListener('transitionend', () => {
      if (this.isOpen) {
        this.input.focus();
      }
    });
  }

  handleFileSelect(e) {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (!this.attachedFiles.find(f => f.name === file.name && f.size === file.size)) {
        this.attachedFiles.push(file);
      }
    });
    this.updateAttachmentsDisplay();
    e.target.value = ''; // Reset input to allow selecting same file again
  }

  removeFile(index) {
    this.attachedFiles.splice(index, 1);
    this.updateAttachmentsDisplay();
  }

  updateAttachmentsDisplay() {
    if (this.attachedFiles.length === 0) {
      this.attachmentsContainer.style.display = 'none';
      return;
    }

    this.attachmentsContainer.style.display = 'flex';
    this.attachmentsContainer.innerHTML = this.attachedFiles.map((file, index) => {
      const fileIcon = this.getFileIcon(file.type);
      const fileSize = this.formatFileSize(file.size);
      return `
        <div class="chatbot-attachment">
          <svg class="chatbot-attachment-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            ${fileIcon}
          </svg>
          <span class="chatbot-attachment-name" title="${file.name}">${file.name}</span>
          <span style="font-size: 0.625rem; color: #6b7280;">${fileSize}</span>
          <button class="chatbot-attachment-remove" onclick="window.chatbot.removeFile(${index})" aria-label="Remove file">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      `;
    }).join('');
  }

  getFileIcon(mimeType) {
    if (mimeType.startsWith('image/')) {
      return '<path d="M4 3C4 2.46957 4.21071 1.96086 4.58579 1.58579C4.96086 1.21071 5.46957 1 6 1H14C14.5304 1 15.0391 1.21071 15.4142 1.58579C15.7893 1.96086 16 2.46957 16 3V11C16 11.5304 15.7893 12.0391 15.4142 12.4142C15.0391 12.7893 14.5304 13 14 13H6C5.46957 13 4.96086 12.7893 4.58579 12.4142C4.21071 12.0391 4 11.5304 4 11V3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 8L7 5L10 8L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>';
    } else if (mimeType.includes('pdf')) {
      return '<path d="M4 3C4 2.46957 4.21071 1.96086 4.58579 1.58579C4.96086 1.21071 5.46957 1 6 1H12L16 5V13C16 13.5304 15.7893 14.0391 15.4142 14.4142C15.0391 14.7893 14.5304 15 14 15H6C5.46957 15 4.96086 14.7893 4.58579 14.4142C4.21071 14.0391 4 13.5304 4 13V3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 1V5H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>';
    } else if (mimeType.includes('word') || mimeType.includes('document')) {
      return '<path d="M4 3C4 2.46957 4.21071 1.96086 4.58579 1.58579C4.96086 1.21071 5.46957 1 6 1H12L16 5V13C16 13.5304 15.7893 14.0391 15.4142 14.4142C15.0391 14.7893 14.5304 15 14 15H6C5.46957 15 4.96086 14.7893 4.58579 14.4142C4.21071 14.0391 4 13.5304 4 13V3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 1V5H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 9H13M7 12H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>';
    } else {
      return '<path d="M4 3C4 2.46957 4.21071 1.96086 4.58579 1.58579C4.96086 1.21071 5.46957 1 6 1H12L16 5V13C16 13.5304 15.7893 14.0391 15.4142 14.4142C15.0391 14.7893 14.5304 15 14 15H6C5.46957 15 4.96086 14.7893 4.58579 14.4142C4.21071 14.0391 4 13.5304 4 13V3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 1V5H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>';
    }
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  toggle() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.container.classList.add('open');
      this.input.focus();
      this.hideBadge();
    } else {
      this.container.classList.remove('open');
    }
  }

  close() {
    this.isOpen = false;
    this.container.classList.remove('open');
  }

  sendMessage() {
    const message = this.input.value.trim();
    const files = [...this.attachedFiles];
    
    if (!message && files.length === 0) return;

    // Add user message with files
    this.addMessage(message, 'user', files);
    this.input.value = '';
    this.attachedFiles = [];
    this.updateAttachmentsDisplay();
    this.sendBtn.disabled = true;

    // Show typing indicator
    this.showTyping();

    // Simulate AI response (replace with actual API call later)
    setTimeout(() => {
      this.hideTyping();
      const response = this.generateResponse(message, files);
      this.addMessage(response, 'bot');
      this.sendBtn.disabled = false;
      this.input.focus();
    }, 1000 + Math.random() * 1000); // Simulate thinking time
  }

  addMessage(text, type, files = []) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message chatbot-message-${type}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Handle multi-line messages
    if (text) {
      const paragraphs = text.split('\n');
      paragraphs.forEach((para, index) => {
        const p = document.createElement('p');
        p.textContent = para;
        contentDiv.appendChild(p);
      });
    }
    
    // Add files if any
    if (files.length > 0) {
      const filesDiv = document.createElement('div');
      filesDiv.className = 'message-files';
      
      files.forEach(file => {
        const fileDiv = document.createElement('div');
        fileDiv.className = 'message-file';
        
        const iconSvg = this.getFileIcon(file.type);
        const fileSize = this.formatFileSize(file.size);
        
        fileDiv.innerHTML = `
          <svg class="message-file-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            ${iconSvg}
          </svg>
          <span class="message-file-name" title="${file.name}">${file.name}</span>
          <span class="message-file-size">${fileSize}</span>
        `;
        
        filesDiv.appendChild(fileDiv);
      });
      
      contentDiv.appendChild(filesDiv);
    }
    
    messageDiv.appendChild(contentDiv);
    this.messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    
    // Store message
    this.messages.push({ text, type, files, timestamp: Date.now() });
  }

  showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chatbot-message chatbot-message-bot';
    typingDiv.id = 'chatbotTyping';
    typingDiv.innerHTML = `
      <div class="chatbot-typing">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    this.messagesContainer.appendChild(typingDiv);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  hideTyping() {
    const typing = document.getElementById('chatbotTyping');
    if (typing) {
      typing.remove();
    }
  }

  generateResponse(userMessage, files = []) {
    const message = (userMessage || '').toLowerCase();
    const currentStep = window.icpForm?.currentStep || 1;
    const stepNames = ['', 'Company Profile', 'Business Model', 'Pain Points', 'Goals', 'Decision Making', 'Budget', 'Review'];

    // Acknowledge files if provided
    if (files.length > 0) {
      const fileNames = files.map(f => f.name).join(', ');
      const fileAck = files.length === 1 
        ? `I've received your file: ${fileNames}. `
        : `I've received ${files.length} files: ${fileNames}. `;
      
      if (!message) {
        return `${fileAck}How can I help you with these files? I can analyze them, extract information, or answer questions about their content.`;
      }
      
      // Continue with normal response but acknowledge files
      const baseResponse = this.getBaseResponse(message, currentStep, stepNames);
      return `${fileAck}${baseResponse}`;
    }

    // No files, return normal response
    return this.getBaseResponse(message, currentStep, stepNames);
  }

  getBaseResponse(message, currentStep, stepNames) {
    // Context-aware responses based on current step
    if (message.includes('help') || message.includes('what') || message.includes('how')) {
      if (currentStep === 1) {
        return `I can help you with the Company Profile section! This step asks about:\n\n• Company Size: The number of employees\n• Industry: The sector they operate in\n• Annual Revenue: Their financial scale\n• Primary Location: Geographic focus\n\nWhat specific question do you have?`;
      } else if (currentStep === 2) {
        return `You're working on the Business Model section. This helps define:\n\n• Business Type: B2B, B2C, B2B2C, or Marketplace\n• Target Market: Who they serve\n• Maturity Stage: How established they are\n• Technology Stack: Tools they use\n\nNeed help with any of these?`;
      } else if (currentStep === 3) {
        return `The Pain Points section identifies problems your ICP faces:\n\n• Primary Pain Point: Main problem\n• Secondary Pain Points: Additional challenges\n• Current Solution: How they handle it now\n• Pain Severity: How urgent it is\n\nWhat would you like to know?`;
      } else if (currentStep === 4) {
        return `Goals & Objectives define what your ICP wants to achieve:\n\n• Primary Goal: Main objective\n• Success Metrics: How they measure success\n• Desired Outcome: What success looks like\n• Timeline: When they need results\n\nI can help clarify any of these!`;
      } else if (currentStep === 5) {
        return `Decision Making covers who buys and how:\n\n• Decision Maker: Primary buyer\n• Influencers: Others involved\n• Committee Size: Number of decision makers\n• Decision Criteria: What matters to them\n• Sales Cycle: How long it takes\n\nWhat do you need help with?`;
      } else if (currentStep === 6) {
        return `Budget & Readiness assesses purchase capability:\n\n• Budget Range: Available funds\n• Approval Status: If budget is approved\n• Purchase Timeframe: When they'll buy\n• Competitor Usage: Current solutions\n• Switching Barriers: What prevents change\n\nNeed guidance on any of these?`;
      } else {
        return `You're on the Review step! This is where you can see all your ICP information and export it.\n\nI can help you understand any section or answer questions about your Ideal Customer Profile. What would you like to know?`;
      }
    }

    // General responses
    if (message.includes('company size') || message.includes('employees')) {
      return `Company size helps you understand the scale of your target customers. Consider:\n\n• Small (1-50): Often more agile, faster decisions\n• Medium (51-500): Growing companies, more structure\n• Large (500+): Enterprise-level, complex processes\n\nChoose the range that best matches your ideal customer.`;
    }

    if (message.includes('industry') || message.includes('sector')) {
      return `Industry selection helps you focus on companies in specific sectors. If your ICP spans multiple industries, you can select "Other" and note the specific industries in the location or target market fields.`;
    }

    if (message.includes('revenue') || message.includes('budget')) {
      return `Revenue and budget are related but different:\n\n• Revenue: How much money the company makes annually\n• Budget: How much they can spend on your solution\n\nGenerally, budget is 1-5% of revenue for most software solutions, but this varies by industry and need.`;
    }

    if (message.includes('pain point') || message.includes('problem')) {
      return `Pain points are problems your ICP is actively trying to solve. Good pain points are:\n\n• Specific and measurable\n• Causing real business impact\n• Not easily solved with current tools\n• Aligned with what your solution addresses\n\nThink about what keeps your ideal customer up at night.`;
    }

    if (message.includes('decision maker') || message.includes('buyer')) {
      return `The decision maker is the person who can approve the purchase. Consider:\n\n• Who has budget authority?\n• Who feels the pain most?\n• Who benefits from the solution?\n\nOften it's a VP, Director, or C-level executive depending on the solution type.`;
    }

    if (message.includes('sales cycle') || message.includes('timeline')) {
      return `Sales cycle length depends on:\n\n• Budget size (larger = longer)\n• Number of decision makers (more = longer)\n• Urgency of the problem\n• Company size and processes\n\nTypical cycles:\n• <$10K: 30-60 days\n• $10K-$50K: 60-90 days\n• $50K+: 90-180+ days`;
    }

    // Default response
    return `I'm here to help you define your Ideal Customer Profile! You're currently on step ${currentStep}: ${stepNames[currentStep]}.\n\nI can help you understand:\n• What each field means\n• How to think about your answers\n• Best practices for ICP definition\n• Any specific questions about the form\n\nWhat would you like to know?`;
  }

  showBadge(count = 1) {
    this.badge.textContent = count;
    this.badge.style.display = 'flex';
  }

  hideBadge() {
    this.badge.style.display = 'none';
  }
}

// Initialize the form when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.icpForm = new ICPForm();
  window.chatbot = new Chatbot();
});

