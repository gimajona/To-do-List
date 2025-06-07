import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [taskList, setTaskList] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [taskInputText, setTaskInputText] = useState('');
  
  const [motivationalQuote, setMotivationalQuote] = useState({ 
    text: 'Loading quote...', 
    author: '' 
  });
  
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(taskList));
    console.log('Tasks saved to storage!');
  }, [taskList]);

  useEffect(() => {
  const getNewQuote = async () => {
  setIsLoadingQuote(true);
  try {
    const response = await fetch('https://api.api-ninjas.com/v1/quotes', {
      headers: { 'X-Api-Key': '6HZN75K91J0gTf4Xk5Rs0A==3q38b0Zilj0Q1s2J' },
    });
    if (!response.ok) throw new Error('Quote API not working');
    const data = await response.json();
    setMotivationalQuote({ text: data[0].quote, author: data[0].author });
  } catch (error) {
    console.error('Error getting quote:', error);
    setMotivationalQuote({
      text: "Couldn't get a quote right now. Will try again later.",
      author: '',
    });
  } finally {
    setIsLoadingQuote(false);
  }
    };

    getNewQuote();
    
    const quoteRefreshTimer = setInterval(getNewQuote, 900000);
    
    return () => {
      clearInterval(quoteRefreshTimer);
      console.log('Quote timer stopped');
    };
  }, []);


  const addTask = (event) => {
    event.preventDefault();
    
    if (taskInputText.trim() === '') {
      console.log('Empty task not added');
      return;
    }
    
    const newTask = {
      id: Date.now(), 
      text: taskInputText.trim(), 
      completed: false 
    };
    
    setTaskList([...taskList, newTask]);
    console.log('Added task:', newTask.text);
    
    setTaskInputText('');
  };

  const toggleTaskStatus = (taskId) => {
    const updatedTasks = taskList.map(task => {
      if (task.id === taskId) {
        return { 
          ...task, 
          completed: !task.completed 
        };
      }
      return task;
    });
    
    setTaskList(updatedTasks);
    console.log('Toggled task status:', taskId);
  };

  const removeTask = (taskId) => {
    const remainingTasks = taskList.filter(task => task.id !== taskId);
    setTaskList(remainingTasks);
    console.log('Removed task:', taskId);
  };

  useEffect(() => {
    console.log('Loading fonts...');
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Pacifico&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
    
    return () => {
      document.head.removeChild(fontLink);
      console.log('Font link removed!');
    };
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 py-8 px-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-pink-400 to-purple-400 p-6 text-white text-center">
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Pacifico, cursive' }}>Today, Mary</h1>
          <p className="opacity-90">For the girl who gets it done! ✨</p>
        </div>
        
        <div className="p-6">
          <form onSubmit={addTask} className="mb-6">
            <div className="flex items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus-within:border-pink-400 focus-within:ring-2 focus-within:ring-pink-200">
              <input
                type="text"
                value={taskInputText}
                onChange={(event) => setTaskInputText(event.target.value)}
                placeholder="Add a new task..."
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
              />

              <button 
                type="submit" 
                className="ml-2 text-pink-500 hover:text-pink-600 transition-colors"
                aria-label="Add task"
              >
                <span className="text-xl">+</span>
              </button>
            </div>
          </form>
          
          <div className="space-y-3 mb-8">
            {taskList.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <p>Your list is empty! Add some tasks.</p>
              </div>
            ) : (
              taskList.map(task => (
                <div 
                  key={task.id} 
                  className={`flex items-center p-3 bg-gray-50 rounded-xl ${
                    task.completed ? 'opacity-70' : ''
                  }`}
                >
                  <div 
                    onClick={() => toggleTaskStatus(task.id)}
                    className="flex-1 cursor-pointer flex items-center"
                  >
                    <span 
                      className={`${
                        task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                      }`}
                    >
                      {task.text}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => removeTask(task.id)}
                    className="text-gray-400 hover:text-red-500 ml-2"
                    aria-label="Delete task"
                  >
                    <span className="text-base">×</span>
                  </button>
                </div>
              ))
            )}
          </div>
          
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-5 relative">
            <div className="absolute top-4 left-4 text-purple-400 opacity-60">
              <span className="text-xl">❝</span>
            </div>
            
            <div className="pl-8 pr-2">
              {isLoadingQuote ? (
                <div className="h-16 flex items-center justify-center">
                  <p className="text-gray-500">Loading a new quote...</p>
                </div>
              ) : (
                <>
                  <p className="text-gray-700 italic mb-2">{motivationalQuote.text}</p>
                  {motivationalQuote.author && (
                    <p className="author">- {motivationalQuote.author}</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
