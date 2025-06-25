# Meeting Leader Scheduler

An Angular web application for managing meeting leader scheduling in a small development team. The application helps schedule who will act as leader for different types of meetings.

## Features

### Team Management
- Add, edit, and remove team members
- View active team member list
- CRUD operations for team management

### Refinement Rotation
- Dynamic queue system where leaders rotate to the back after leading
- Drag-and-drop reordering of the queue
- Mark refinements as completed to automatically rotate the queue
- Visual indication of who's next to lead

### Stand-up Scheduling  
- Fixed weekly schedule based on days of the week
- Assign specific team members to lead on specific days
- Auto-assign rotation feature for quick setup
- Today's leader highlighting

### Dashboard Overview
- Quick view of today's stand-up leader
- Next refinement leader display
- Team statistics overview
- Quick actions for marking completions

## Tech Stack

- **Frontend**: Angular 18 with TypeScript
- **UI Components**: Angular Material
- **Styling**: SCSS
- **Data Storage**: LocalStorage (in-memory database service)
- **Architecture**: Standalone components

## Getting Started

### Prerequisites
- Node.js (v20.11.0 or higher)
- npm (v10.2.4 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Doxens.MeetingLeadScheduler
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:4200`

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Usage

### Setting Up Your Team

1. Go to the **Team** section
2. Add your team members using the "Add Team Member" button
3. Edit or remove members as needed

### Configuring Refinement Rotation

1. Navigate to the **Refinements** section
2. Add team members to the queue by clicking on them in the "Available Team Members" list
3. Drag and drop to reorder the queue as needed
4. Use "Mark as Completed" to rotate the queue after each refinement

### Setting Up Stand-up Schedule

1. Go to the **Stand-ups** section
2. Assign team members to specific days of the week
3. Use "Auto-assign Rotation" for quick setup
4. View today's leader on the dashboard

### Dashboard Monitoring

The dashboard provides a quick overview of:
- Today's stand-up leader
- Next refinement leader
- Team statistics
- Quick actions for marking completions

## Data Persistence

The application uses browser localStorage to persist data between sessions. All team members, schedules, and queue configurations are automatically saved and restored when you reload the application.

## Development

### Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard/
│   │   ├── team/
│   │   ├── refinements/
│   │   └── standups/
│   ├── models/
│   │   └── models.ts
│   ├── services/
│   │   └── database.service.ts
│   ├── app.component.*
│   ├── app.config.ts
│   └── app.routes.ts
├── styles.scss
└── main.ts
```

### Key Components

- **DashboardComponent**: Overview and quick actions
- **TeamComponent**: Team member management with dialog for add/edit
- **RefinementsComponent**: Queue management with drag-and-drop
- **StandupsComponent**: Weekly schedule configuration
- **DatabaseService**: In-memory data management with localStorage persistence

### Running Tests

```bash
npm test
```

### Code Style

The project follows Angular best practices:
- Standalone components architecture
- Reactive forms for user input
- Angular Material for consistent UI
- TypeScript strict mode
- SCSS for styling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
