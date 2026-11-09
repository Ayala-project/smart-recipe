import { Component } from '@angular/core';
import { OnInit } from '../../node_modules/@angular/core/index';
import { classes } from '../app/classes';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-class',
  imports: [FormsModule],
  templateUrl: './class.component.html',
  standalone: true,
  styleUrl: './class.component.css'
})
export class ClassComponent implements OnInit {
  ngOnInit() {
    this.arr.push(new classes(1, 'אסמבלר', 'elish', 50, false, 'img/2965.jpg', 10))
    this.arr.push(new classes(2, 'מערכות הפעלה ', 'ayala', 100, false, 'img/5764.jpg', 0))
    this.arr.push(new classes(3, 'סטטיסטיקה ', 'odel', 150, true, 'img/8917.jpg', 5))
    this.arr.push(new classes(4, 'אלגברה ', 'rut', 200, true, 'img/11297.jpg', 20))
    this.arr.push(new classes(5, 'תקשורת', 'eliana', 250, false, 'img/12301.jpg', 2))
  }
  arr: Array<classes> = new Array<classes>()
  rishum(c: classes) {
    c.place_class--

  }
  h1: string = 'hello'
  h2: string = 'wellcome to the class'
  chug: classes = new classes()
  ae: boolean = true
  add() {
    if (this.ae) {
      this.arr.push(this.chug)
    }
    else {
      let i = this.arr.findIndex(x => x.id = this.chug.id)
      this.arr[i]=this.chug
      this.ae=true
    }
    this.chug=new classes()
  }
  aricha(c: classes) {
    this.ae=false
    this.chug = {...c}

  }
}



