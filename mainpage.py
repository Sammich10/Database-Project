#Run "pip3 install tk" in terminal to download tkinter
import tkinter as tk

window = tk.Tk()

greeting = tk.Label(text="Hello World!")
greeting.pack()

window.mainloop()
