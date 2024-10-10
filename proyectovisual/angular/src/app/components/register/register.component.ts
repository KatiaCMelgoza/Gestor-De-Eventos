import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterService } from '../../services/register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  private httpService = inject(RegisterService)
  formUser!:FormGroup

  ngOnInit(): void {
    this.formUser = new FormGroup({
      nombre: new FormControl("",Validators.required),
      apellido: new FormControl("",Validators.required),
      telefono: new FormControl("",Validators.required),
      correo: new FormControl("",[Validators.required,Validators.email]),
      password: new FormControl("",Validators.required),
    })
  }

  sendDataToService(){
    console.log(this.formUser.value)
    this.httpService.registerUser(this.formUser.value)
  }

}
