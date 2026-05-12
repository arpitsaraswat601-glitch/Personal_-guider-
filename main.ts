// --- TYPESCRIPT CORE CONFIG ---
interface UserProfile {
    firstName: string;
    lastName: string;
    age: number;
    type: 'Student' | 'Worker' | 'Child';
    rank: string;
}

interface AppState {
    user: UserProfile | null;
    points: { focus: number; health: number; discipline: number };
    startTime: number;
    level: number;
    language: 'EN' | 'HI';
}

class PersonalGuider {
    private state: AppState;
    private timerInterval: any;

    constructor() {
        // Strict Data Loading
        const savedData = localStorage.getItem('PG_CORE_DATA');
        this.state = savedData ? JSON.parse(savedData) : {
            user: null,
            points: { focus: 0, health: 0, discipline: 0 },
            startTime: Date.now(),
            level: 1,
            language: 'EN'
        };
        this.bootSystem();
    }

    private bootSystem(): void {
        if (!this.state.user) {
            this.showOnboarding();
        } else {
            this.launchDashboard();
        }
    }

    private showOnboarding(): void {
        document.getElementById('onboarding-screen')?.classList.remove('hidden');
    }

    public registerUser(): void {
        const fName = (document.getElementById('fName') as HTMLInputElement).value;
        const lName = (document.getElementById('lName') as HTMLInputElement).value;
        const age = parseInt((document.getElementById('uAge') as HTMLInputElement).value);
        const type = (document.getElementById('uType') as HTMLSelectElement).value as any;

        if (fName && lName && age) {
            this.state.user = { firstName: fName, lastName: lName, age, type, rank: "NOVICE" };
            this.state.startTime = Date.now();
            this.saveAndReload();
        } else {
            this.hapticFeedback('error');
            alert("System requires full identification.");
        }
    }

    private launchDashboard(): void {
        document.getElementById('onboarding-screen')?.classList.add('hidden');
        document.getElementById('main-app')?.classList.remove('hidden');
        (document.getElementById('user-name') as HTMLElement).innerText = this.state.user?.firstName.toUpperCase() || "OPERATOR";
        this.startEngine();
    }

    private startEngine(): void {
        // High-Precision Timer
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);
        this.updateUI();
    }

    private updateTimer(): void {
        const diff = Date.now() - this.state.startTime;
        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff / 3600000) % 24);
        const mins = Math.floor((diff / 60000) % 60);
        const secs = Math.floor((diff / 1000) % 60);

        const display = `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        (document.getElementById('timer-display') as HTMLElement).innerText = display;
    }

    public addPoints(category: 'focus' | 'health'): void {
        this.state.points[category] += 10;
        this.hapticFeedback('success');
        this.save();
    }

    private hapticFeedback(type: 'success' | 'error'): void {
        if (navigator.vibrate) {
            type === 'success' ? navigator.vibrate(40) : navigator.vibrate([50, 30, 50]);
        }
    }

    private save(): void {
        localStorage.setItem('PG_CORE_DATA', JSON.stringify(this.state));
        this.updateUI();
    }

    private saveAndReload(): void {
        localStorage.setItem('PG_CORE_DATA', JSON.stringify(this.state));
        location.reload();
    }

    private updateUI(): void {
        (document.getElementById('focus-val') as HTMLElement).innerText = this.state.points.focus.toString();
        (document.getElementById('health-val') as HTMLElement).innerText = this.state.points.health.toString();
    }
}

// System Startup
const app = new PersonalGuider();
