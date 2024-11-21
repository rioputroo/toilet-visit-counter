import { Component, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ToiletVisit {
  timestamp: Date;
  userId: string;
}

interface User {
  id: string;
  name: string;
  visits: ToiletVisit[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <!-- Card -->
      <div class="flex flex-col">
        <div class="-m-1.5 overflow-x-auto">
          <div class="p-1.5 min-w-full inline-block align-middle">
            <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <!-- Header -->
              <div class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200">
                <div>
                  <h2 class="text-xl font-semibold text-gray-800">
                    Toilet Visit Tracker
                  </h2>
                  <p class="text-sm text-gray-600">
                    Track daily toilet visits for multiple users
                  </p>
                </div>

                <div>
                  <div class="inline-flex gap-x-2">
                    <button
                      class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
                      (click)="showAddUserModal = true">
                      <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                      </svg>
                      Add User
                    </button>
                  </div>
                </div>
              </div>

              <!-- Users Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                <div *ngFor="let user of users" class="bg-white border rounded-xl shadow-sm p-4">
                  <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-800">{{ user.name }}</h3>
                    <span class="text-2xl font-bold text-blue-600">{{ user.visits.length }}</span>
                  </div>
                  
                  <div class="space-y-3">
                    <button
                      class="w-full py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
                      (click)="addVisit(user.id)">
                      Add Visit
                    </button>
                    
                    <div class="text-sm text-gray-600">
                      Last visit: {{ user.visits.length > 0 ? (user.visits[user.visits.length - 1].timestamp | date:'HH:mm:ss') : 'No visits' }}
                    </div>
                    
                    <div class="text-sm" [ngClass]="{
                      'text-green-600': user.visits.length <= 3,
                      'text-yellow-600': user.visits.length > 3 && user.visits.length <= 5,
                      'text-red-600': user.visits.length > 5
                    }">
                      {{ getStatusMessage(user.visits.length) }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Summary Section -->
              <div class="px-6 py-4 border-t border-gray-200">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Daily Summary</h3>
                <div class="space-y-2">
                  <p>Total Visits Today: {{ getTotalVisits() }}</p>
                  <p>Most Frequent Visitor: {{ getMostFrequentVisitor() }}</p>
                  <p>Average Visits per User: {{ getAverageVisits() }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add User Modal -->
      <div *ngIf="showAddUserModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4">
          <div class="fixed inset-0 bg-gray-900 bg-opacity-50"></div>
          
          <div class="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 class="text-xl font-semibold text-gray-800 mb-4">Add New User</h3>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                [(ngModel)]="newUserName"
                class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter user name">
            </div>
            
            <div class="flex justify-end gap-x-2">
              <button
                (click)="showAddUserModal = false"
                class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50">
                Cancel
              </button>
              <button
                (click)="addUser()"
                class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700">
                Add User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class App implements OnInit {
  users: User[] = [];
  showAddUserModal = false;
  newUserName = '';

  ngOnInit() {
    // Initialize with Aldy
    this.users.push({
      id: '1',
      name: 'Aldy',
      visits: []
    });
  }

  addUser() {
    if (this.newUserName.trim()) {
      this.users.push({
        id: (this.users.length + 1).toString(),
        name: this.newUserName.trim(),
        visits: []
      });
      this.newUserName = '';
      this.showAddUserModal = false;
    }
  }

  addVisit(userId: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.visits.push({
        timestamp: new Date(),
        userId: userId
      });
    }
  }

  getStatusMessage(visitCount: number): string {
    if (visitCount === 0) {
      return 'No visits today';
    } else if (visitCount <= 3) {
      return 'Normal frequency';
    } else if (visitCount <= 5) {
      return 'Above average frequency';
    } else {
      return 'Medical attention recommended';
    }
  }

  getTotalVisits(): number {
    return this.users.reduce((total, user) => total + user.visits.length, 0);
  }

  getMostFrequentVisitor(): string {
    if (this.users.length === 0) return 'No users';
    
    const mostFrequent = this.users.reduce((prev, current) => 
      prev.visits.length > current.visits.length ? prev : current
    );
    
    return mostFrequent.visits.length === 0 ? 'No visits yet' : `${mostFrequent.name} (${mostFrequent.visits.length} visits)`;
  }

  getAverageVisits(): string {
    if (this.users.length === 0) return '0';
    const average = this.getTotalVisits() / this.users.length;
    return average.toFixed(1);
  }
}

bootstrapApplication(App);