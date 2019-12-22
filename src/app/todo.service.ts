import { Injectable } from '@angular/core';
import {TodoListData} from './dataTypes/TodoListData';
import {Observable, BehaviorSubject} from 'rxjs';
import {TodoItemData} from './dataTypes/TodoItemData';

@Injectable()
export class TodoService {

  private todoListSubject = new BehaviorSubject<TodoListData>( {label: 'TodoList', items: []} );
  private listUndo: TodoListData[]= [];
  private listRedo: TodoListData[]= [];
  constructor() { }

  getTodoListDataObserver(): Observable<TodoListData> {
    return this.todoListSubject.asObservable();
  }

  setItemsLabel(label: string, ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label,
      items: tdl.items.map( I => items.indexOf(I) === -1 ? I : ({label, isDone: I.isDone}) )
    });
    this.saveAction(tdl);// on sauvegarde la dernière action que l'on vient de réaliser
  }

  setItemsDone(isDone: boolean, ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label,
      items: tdl.items.map( I => items.indexOf(I) === -1 ? I : ({label: I.label, isDone}) )
    });
    this.saveAction(tdl);
  }

  appendItems( ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label, // ou on peut écrire: ...tdl,
      items: [...tdl.items, ...items]
    });
    this.saveAction(tdl);
  }

  removeItems( ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label, // ou on peut écrire: ...tdl,
      items: tdl.items.filter( I => items.indexOf(I) === -1 )
    });
    this.saveAction(tdl);
  }

  undo(){
    if(this.listUndo.length !== 0){
      this.listRedo.push(this.todoListSubject.getValue());
      const action = this.listUndo.pop();
      this.todoListSubject.next({
        label: action.label,
        items: action.items
      });
    }
  }
  redo(){
    if(this.listRedo.length !== 0){
      this.listUndo.push(this.todoListSubject.getValue());
      const action = this.listRedo.pop();
      this.todoListSubject.next({
        label: action.label,
        items: action.items
      });
    }
  }

  saveAction(before:TodoListData){
    this.listUndo.push(before);
    this.listRedo= [];
  }

}
