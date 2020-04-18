import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CinemaService} from '../services/cinema.service';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {

  public villes;
  public cinemas;
  public currentVille;
  public currentCinema;
  public salles;
  public currentProjection;
  public selectedTickets;

  constructor(public cinemaService:CinemaService) { }

  ngOnInit() {
    this.cinemaService.getVilles().subscribe(data => {
      this.villes = data;
    }, error => {
      console.log(error);
    })
  }

  onGetCinema(v) {
    this.currentVille = v;
    this.salles = undefined;
    this.cinemaService.getCinemas(v).subscribe(data => {
      this.cinemas = data;
    }, error => {
      console.log(error);
    })
  }

  onGetSalles(c) {
    this.currentCinema = c;
    this.cinemaService.getSalles(c).subscribe(data => {
      this.salles = data;
      this.salles._embedded.salles.forEach(salle => {
        this.cinemaService.getProjections(salle).subscribe( data => {
          salle.projections = data;
          }
        )
      })
    }, error => {
      console.log(error);
    })
  }

  onGetPlaces(p) {
    this.currentProjection = p;
    this.cinemaService.getTicketsPlace(p)
      .subscribe(data => {
        this.currentProjection.tickets = data;
        this.selectedTickets = [];
      }, error => {
      console.log(error);
    })
  }

  onSelectTicket(t) {
    if (!t.selected){
      t.selected = true;
      this.selectedTickets.push(t);
    } else {
      t.selected = false;
      this.selectedTickets.splice(this.selectedTickets.indexOf(t), 1);
    }
    console.log(this.selectedTickets)
  }

  getTicketClass(t) {
    let str = "btn ticket ";
    if (t.reserved == true){
      str += "btn-danger";
    } else if (t.selected) {
      str += "btn-warning";
    } else {
      str += "btn-success";
    }
    return str;
  }

  onPayTicket(dataForm) {
    let tickets = [];
    this.selectedTickets.forEach(t => {
      tickets.push(t.id);
    });

    console.log("tickets " +tickets);
    dataForm.tickets = tickets;
    console.log("dataForm " +dataForm);
    this.cinemaService.payerTickets(dataForm).subscribe(data => {
      alert("Tickets réservés avec succès")
      this.onGetPlaces(this.currentProjection)
    }, err => {

    })
  }
}
