import React from "react";
import ConsultantList from "./ConsultantList";
import FullFeaturedCrudGrid from './Table';
import TripTracker from "./Trip";
import ExpenseGraph from "./ExpenseGraph";
import LastFiveExpenses from "./LastFiveExpenses";

function App() {
    return (
        <div>
             <FullFeaturedCrudGrid />
             <TripTracker />
             <ConsultantList />
             <ExpenseGraph />
             <LastFiveExpenses />
        </div>
        
       
    );
}

export default App;
