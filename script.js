class ProfessionalCalculator {
    constructor() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = '';
        this.waitingForOperand = false;
        this.memory = 0;
        this.expression = '';
        this.isScientific = false;
        
        this.display = document.getElementById('result');
        this.expressionDisplay = document.getElementById('expression');
        this.memoryIndicator = document.getElementById('memoryIndicator');
        
        this.initializeEventListeners();
        this.updateDisplay();
    }
    
    initializeEventListeners() {
        // Number and operator buttons
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', this.handleButtonClick.bind(this));
        });
        
        // Theme selector
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', this.changeTheme.bind(this));
        });
        
        // Mode toggle
        document.getElementById('basicMode').addEventListener('click', () => this.toggleMode('basic'));
        document.getElementById('scientificMode').addEventListener('click', () => this.toggleMode('scientific'));
        
        // Keyboard support
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
    }
    
    handleButtonClick(e) {
        const button = e.target;
        const action = button.dataset.action;
        const value = button.dataset.value;
        
        if (value !== undefined) {
            this.inputNumber(value);
        } else if (action) {
            this.handleAction(action);
        }
    }
    
    handleAction(action) {
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'backspace':
                this.backspace();
                break;
            case '=':
                this.calculate();
                break;
            case '+':
            case '-':
            case '*':
            case '/':
            case '%':
                this.inputOperator(action);
                break;
            case 'mc':
                this.memoryClear();
                break;
            case 'mr':
                this.memoryRecall();
                break;
            case 'm+':
                this.memoryAdd();
                break;
            case 'm-':
                this.memorySubtract();
                break;
            case 'sin':
            case 'cos':
            case 'tan':
            case 'log':
            case 'ln':
            case 'sqrt':
            case 'pow':
            case 'pi':
                this.scientificFunction(action);
                break;
        }
    }
    
    inputNumber(num) {
        if (this.waitingForOperand) {
            this.currentInput = num;
            this.waitingForOperand = false;
        } else {
            this.currentInput = this.currentInput === '0' ? num : this.currentInput + num;
        }
        this.updateDisplay();
    }
    
    inputOperator(nextOperator) {
        const inputValue = parseFloat(this.currentInput);
        
        if (this.previousInput === '') {
            this.previousInput = inputValue;
        } else if (this.operator) {
            const currentValue = this.previousInput || 0;
            const newValue = this.performCalculation();
            
            this.currentInput = String(newValue);
            this.previousInput = newValue;
        }
        
        this.waitingForOperand = true;
        this.operator = nextOperator;
        this.expression = `${this.previousInput} ${this.getOperatorSymbol(nextOperator)}`;
        this.updateDisplay();
    }
    
    performCalculation() {
        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);
        
        if (isNaN(prev) || isNaN(current)) return current;
        
        switch (this.operator) {
            case '+': return prev + current;
            case '-': return prev - current;
            case '*': return prev * current;
            case '/': return current !== 0 ? prev / current : 0;
            case '%': return prev % current;
            default: return current;
        }
    }
    
    calculate() {
        if (this.operator && !this.waitingForOperand) {
            const result = this.performCalculation();
            this.expression = '';
            this.currentInput = String(result);
            this.previousInput = '';
            this.operator = '';
            this.waitingForOperand = true;
            this.updateDisplay();
        }
    }
    
    clear() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = '';
        this.expression = '';
        this.waitingForOperand = false;
        this.updateDisplay();
    }
    
    backspace() {
        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
        }
        this.updateDisplay();
    }
    
    // Memory functions
    memoryClear() {
        this.memory = 0;
        this.updateMemoryIndicator();
    }
    
    memoryRecall() {
        this.currentInput = String(this.memory);
        this.waitingForOperand = true;
        this.updateDisplay();
    }
    
    memoryAdd() {
        this.memory += parseFloat(this.currentInput);
        this.updateMemoryIndicator();
    }
    
    memorySubtract() {
        this.memory -= parseFloat(this.currentInput);
        this.updateMemoryIndicator();
    }
    
    // Scientific functions
    scientificFunction(func) {
        const value = parseFloat(this.currentInput);
        let result;
        
        switch (func) {
            case 'sin':
                result = Math.sin(value * Math.PI / 180);
                break;
            case 'cos':
                result = Math.cos(value * Math.PI / 180);
                break;
            case 'tan':
                result = Math.tan(value * Math.PI / 180);
                break;
            case 'log':
                result = Math.log10(value);
                break;
            case 'ln':
                result = Math.log(value);
                break;
            case 'sqrt':
                result = Math.sqrt(value);
                break;
            case 'pow':
                result = Math.pow(value, 2);
                break;
            case 'pi':
                result = Math.PI;
                break;
            default:
                return;
        }
        
        this.currentInput = String(result);
        this.waitingForOperand = true;
        this.updateDisplay();
    }
    
    updateDisplay() {
        this.display.textContent = this.formatNumber(this.currentInput);
        this.expressionDisplay.textContent = this.expression;
    }
    
    updateMemoryIndicator() {
        this.memoryIndicator.textContent = this.memory !== 0 ? `M: ${this.formatNumber(this.memory)}` : '';
    }
    
    formatNumber(num) {
        const number = parseFloat(num);
        if (isNaN(number)) return '0';
        
        // Handle very large or very small numbers
        if (Math.abs(number) > 1e15 || (Math.abs(number) < 1e-6 && number !== 0)) {
            return number.toExponential(6);
        }
        
        return number.toString();
    }
    
    getOperatorSymbol(op) {
        const symbols = { '+': '+', '-': '-', '*': '×', '/': '÷', '%': '%' };
        return symbols[op] || op;
    }
    
    toggleMode(mode) {
        const basicBtn = document.getElementById('basicMode');
        const scientificBtn = document.getElementById('scientificMode');
        const scientificPanel = document.getElementById('scientificPanel');
        
        if (mode === 'scientific') {
            basicBtn.classList.remove('active');
            scientificBtn.classList.add('active');
            scientificPanel.classList.add('active');
            this.isScientific = true;
        } else {
            scientificBtn.classList.remove('active');
            basicBtn.classList.add('active');
            scientificPanel.classList.remove('active');
            this.isScientific = false;
        }
    }
    
    changeTheme(e) {
        const theme = e.target.dataset.theme;
        const themes = {
            purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            blue: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
            green: 'linear-gradient(135deg, #55efc4 0%, #00b894 100%)',
            orange: 'linear-gradient(135deg, #fd79a8 0%, #e84393 100%)',
            dark: 'linear-gradient(135deg, #2d3436 0%, #636e72 100%)'
        };
        
        document.body.style.background = themes[theme];
        
        // Update active theme button
        document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
    }
    
    handleKeyboard(e) {
        e.preventDefault();
        
        if (e.key >= '0' && e.key <= '9' || e.key === '.') {
            this.inputNumber(e.key);
        } else if (['+', '-', '*', '/', '%'].includes(e.key)) {
            this.inputOperator(e.key);
        } else if (e.key === 'Enter' || e.key === '=') {
            this.calculate();
        } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
            this.clear();
        } else if (e.key === 'Backspace') {
            this.backspace();
        }
    }
}

// Initialize calculator when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ProfessionalCalculator();
});