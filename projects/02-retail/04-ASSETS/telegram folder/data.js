const lessons = [
    {
        id: 1,
        module: "Module 1",
        title: "Customer Service Excellence",
        status: "completed",
        duration: 15,
        score: "92%"
    },
    {
        id: 2,
        module: "Module 2",
        title: "Building Trust & Rapport",
        status: "in-progress",
        duration: 20,
        score: "In Progress"
    },
    {
        id: 3,
        module: "Module 3",
        title: "Product Knowledge Mastery",
        status: "pending",
        duration: 18,
        score: "Not Started"
    },
    {
        id: 4,
        module: "Module 4",
        title: "Handling Objections",
        status: "locked",
        duration: 25,
        score: "Locked"
    },
    {
        id: 5,
        module: "Module 5",
        title: "Closing Techniques",
        status: "locked",
        duration: 22,
        score: "Locked"
    },
    {
        id: 6,
        module: "Module 6",
        title: "Upselling & Cross-selling",
        status: "locked",
        duration: 30,
        score: "Locked"
    },
    {
        id: 7,
        module: "Module 7",
        title: "Managing Difficult Customers",
        status: "locked",
        duration: 28,
        score: "Locked"
    },
    {
        id: 8,
        module: "Module 8",
        title: "Payment Processing",
        status: "locked",
        duration: 15,
        score: "Locked"
    },
    {
        id: 9,
        module: "Module 9",
        title: "Store Presentation",
        status: "locked",
        duration: 20,
        score: "Locked"
    },
    {
        id: 10,
        module: "Module 10",
        title: "Team Collaboration",
        status: "locked",
        duration: 25,
        score: "Locked"
    },
    {
        id: 11,
        module: "Module 11",
        title: "Sales Analytics",
        status: "locked",
        duration: 18,
        score: "Locked"
    },
    {
        id: 12,
        module: "Module 12",
        title: "Leadership Skills",
        status: "locked",
        duration: 35,
        score: "Locked"
    }
];

const routines = {
    "Morning Setup": [
        {
            title: "Store Opening Checklist",
            description: "Complete all opening procedures: lights, music, displays, cash register",
            duration: "10",
            priority: "high",
            type: "checklist"
        },
        {
            title: "Daily Sales Goal Review",
            description: "Check today's targets and plan your approach",
            duration: "5",
            priority: "medium",
            type: "checklist"
        },
        {
            title: "Product Knowledge Refresh",
            description: "Review 3 key product features for today's focus items",
            duration: "15",
            priority: "medium",
            type: "checklist"
        }
    ],
    "Customer Interactions": [
        {
            title: "Greet Customers",
            description: "Welcome customers within 30 seconds of entry",
            duration: "1",
            priority: "high",
            type: "counter",
            goal: 20,
            unit: "customers"
        },
        {
            title: "Product Demonstrations",
            description: "Show customers how products work or fit",
            duration: "5",
            priority: "medium",
            type: "counter",
            goal: 8,
            unit: "demos"
        },
        {
            title: "Follow-up Questions",
            description: "Ask 'How can I help you find what you need?'",
            duration: "2",
            priority: "medium",
            type: "counter",
            goal: 15,
            unit: "interactions"
        }
    ],
    "End of Day": [
        {
            title: "Sales Summary",
            description: "Record your sales numbers and customer feedback",
            duration: "10",
            priority: "high",
            type: "checklist"
        },
        {
            title: "Store Closing Tasks",
            description: "Tidy displays, secure cash, lock up properly",
            duration: "15",
            priority: "high",
            type: "checklist"
        },
        {
            title: "Tomorrow's Preparation",
            description: "Set up displays and materials for next day",
            duration: "10",
            priority: "medium",
            type: "checklist"
        }
    ]
}; 