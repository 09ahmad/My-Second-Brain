import { Button } from "./components/ui/Button";
import { useState } from "react";
import {PlusIcon} from "./icons/PlusIcon"; 
import {ShareIcon} from "./icons/ShareIcon";
function App() {
  return (
    <div>
      <Button
        startIcon={<PlusIcon size="lg"/>} 
        size="sm" 
        variant="primary" 
        text="Share" 
        endIcon={<ShareIcon size="lg" />}/>
        
      <Button 
        size="md" 
        variant="secondary" 
        text="Add Content"  />
      <Button 
        size="lg" 
        variant="secondary" 
        text="Add Content"  />
    </div>
  )
}

export default App
