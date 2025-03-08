import React from "react";
import ConsultantList from "./ConsultantList";
import FullFeaturedCrudGrid from './Table';
import TripTracker from "./Trip";
import ExpenseGraph from "./ExpenseGraph";

function App() {
    return (
        <div>
             <FullFeaturedCrudGrid />
             <TripTracker />
             <ConsultantList />
             <ExpenseGraph />
        </div>
        
       
    );
}

export default App;
