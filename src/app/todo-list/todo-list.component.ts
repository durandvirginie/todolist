import {ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, ElementRef, HostListener} from '@angular/core';
import {TodoListData} from '../dataTypes/TodoListData';
import {TodoItemData} from '../dataTypes/TodoItemData';
import {TodoService} from '../todo.service';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
type FCT_FILTER_ITEMS =(item: TodoItemData) => boolean;

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  
  @Input() private data: TodoListData;
  private titre: string; // pour gérer le titre de la liste 
  faUndo = faUndo;
  faRedo = faRedo;

  @ViewChild("newTodoInput", {static: false}) newTodoInput: ElementRef;

  filterAll: FCT_FILTER_ITEMS =() => true;  // tous les filtre
  currentFilter = this.filterAll;  // filtres actuels
  filterDone: FCT_FILTER_ITEMS =(item) => item.isDone; // filtres cochés (faits)
  filterUnDone: FCT_FILTER_ITEMS =(item) => !item.isDone; // filtres pas encore cochés (à faire)
  
  constructor(private todoService: TodoService) {  
    todoService.getTodoListDataObserver().subscribe( tdl => this.data = tdl );  
    this.titre = this.data.label;
  }

  //récupère les tâches selon leur filtre (fait, à faire,...)
  getFilteredItems():TodoItemData[]{
    return this.data ? this.data.items.filter(this.currentFilter) : [];
  }

  ngOnInit() {
  }

  get label(): string {
    return this.data ? this.data.label : '';
  }
  
  get items(): TodoItemData[] {
    return this.data ? this.data.items : [];
  }
  // coche une tâche de la liste
  itemDone(item: TodoItemData, done: boolean) {
    this.todoService.setItemsDone( done, item );
  }
  
  itemLabel(item: TodoItemData, label: string) {
    this.todoService.setItemsLabel( label, item );
  }
  

  appendItem(label: string) {
    this.todoService.appendItems( {
      label,
      isDone: false
    } );
  }

  // suppression d'une des tâches de la liste
  removeItem(item: TodoItemData) {
    this.todoService.removeItems(item);
  }
  
  // retourne l'état de la tâche (cochée ou non)
  isAllDone(): boolean {
    return this.items.every( it => it.isDone );
  }
  
  toggleAllDone() {
    const done = !this.isAllDone();
    this.todoService.setItemsDone(done, ...this.items);
  }
  // on calcule le nombre de tâches qui ne sont pas cochées dans la liste 
  nbItems():number{
    return (this.data.items.length - this.data.items.filter(item=>item.isDone).length);
  }
  // supprime les tâches cochées
  removeCheckedItems(){
    this.data.items.forEach(item=>{
      if(item.isDone){
        this.todoService.removeItems(item);
      }
    });
  }
  // supprime toutes les tâches de la liste
  removeAllItems(){
    this.data.items.forEach(item=>{
      this.todoService.removeItems(item);
    })
  }

  undo(){
    this.todoService.undo();
  }
  
  redo(){
    this.todoService.redo();
  }
}
