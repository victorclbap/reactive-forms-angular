import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  genders = ['male', 'female'];
  forbiddenUsernames = ['victor', 'carlos'];
  signUpForm: FormGroup;

  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      userData: new FormGroup({
        username: new FormControl(null, [
          Validators.required,
          this.forbiddenNames.bind(this),
        ]), // para ter certeza que this se refere a classe usa bind
        email: new FormControl(
          null,
          [Validators.required, Validators.email],
          this.forbiddenEmails.bind(this)
        ), // 3º campo é reservado para validators assincronos, o segundo para sincronos
      }),
      gender: new FormControl('male'),
      hobbies: new FormArray([]), // array de controls
    });

    // mudança no valor
    // this.signUpForm.valueChanges.subscribe((value)=>console.log(value))

    // mudança no status
    // informa se é valido, inválido , pendente...
    // this.signUpForm.statusChanges.subscribe((value)=>console.log(value))

    this.signUpForm.setValue({
      userData: {
        username: 'Victor',
        email: 'victor@gmail.com',
      },
      gender: 'male',
      hobbies: [],
    });
  }

  get hobbiesControls() {
    return (<FormArray>this.signUpForm.get('hobbies')).controls;
  }

  onSubmit() {
    console.log(this.signUpForm.valid);
    console.log(this.signUpForm.touched);
    this.signUpForm.reset();
  }

  // adiciona formcontrols dinamicamente
  // faz o push nos controls de hobbies, conforme os inputs sao adicionados
  // o control name vai ser o index do array

  onAddHobby() {
    const control = new FormControl(null, Validators.required);
    (this.signUpForm.get('hobbies') as FormArray) //faz o casting para FormArray
      .push(control);
  }

  // validação
  // recebe o control que vai validar
  // tipo de retorno é um objeto javascript com key string e boolean de valor
  // o objeto do retorno pode ser acessado no objeto errors dos controls

  forbiddenNames(control: FormControl): { [s: string]: boolean } {
    // valida se contem o elemento
    if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
      return { nameIsForbidden: true };
    }
    // sucesso retorna null ou não retorna nada
    return null;
  }

  // validação assíncrona
  // enquanto não ocorre a validação o status fica "pending"
  forbiddenEmails(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'test@test.com') {
          resolve({ emailIsForbidden: true });
        } else {
          return null;
        }
      }, 1500);
    });
    return promise;
  }
}
