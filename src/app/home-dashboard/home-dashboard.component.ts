import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeDashboardService } from '../services/home-dashboard.service';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { PageEvent } from '@angular/material';
import { MatPaginator } from '@angular/material';


@Component({
  selector: 'app-home-dashboard',
  templateUrl: './home-dashboard.component.html',
  styleUrls: ['./home-dashboard.component.css']
})
export class HomeDashboardComponent implements OnInit {
  isClickedOnSearchIcon: boolean = false;
  userAccounts: any;
  userAlbums: any;
  showUserAlbums: boolean = false;
  photos: any;
  checked: boolean;
  photoList: any[] = new Array<any>();
  showFormCardFlag: boolean = false;
  addAlbumForm: FormGroup;
  hideProgressBar: boolean = false;
  droppedItems: any = [];
  isDragAndDropView: boolean = false;
  isClickedOnDroppedItem: boolean = false;
  isClickedOnDraggedItem: boolean = false;
  pagedPhotoList = [];
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageIndex = 0;
  pageEvent: PageEvent;
  isClickedOnAscending: boolean = false;
  isClickedOnDescendning: boolean = false;
  isAlbumDataRecieved: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  showPaginator: boolean = false;
  isClickedOnPagePaginator: boolean = false;
  constructor(private homeDashboardService: HomeDashboardService, private formBuilder: FormBuilder) { }


  ngOnInit() {
    this.hideProgressBar = false;
    this.showuserAccounts();
    this.addAlbumForm = this.formBuilder.group({
      addedAlbum: ['']
    });
  }
  showSearchBar() {
    this.isClickedOnSearchIcon = true;
  }
  hideSearchBar() {
    this.isClickedOnSearchIcon = false;
  }
  showuserAccounts() {
    this.homeDashboardService.showUsers().subscribe((data) => {
      this.userAccounts = data;
    }
    )
  }

  //show the users album according to his id when a click event occurs on a row that a user
  showUsersAlbums(id) {
    this.droppedItems = [];
    this.hideProgressBar = true;
    this.homeDashboardService.userId = id;
    this.showPaginator = false;
    this.pagedPhotoList = [];
    this.homeDashboardService.showUsersAlbums(id).subscribe((data) => {
      this.userAlbums = data;
      this.showUserAlbums = true;
      this.isAlbumDataRecieved = true;
      this.photoList = new Array<any>();
      this.userAlbums.forEach(album => {
        this.homeDashboardService.showUsersPhotos(album.id).subscribe((photos) => {
          album.photos = photos;
        }), (error) => {
          alert("An error has occured")
          alert(error)
        }
      });
    }), (error) => {
      alert("An error has occured")
      alert(error)
    }
  }


  addAlbum() {
    const albumBody = {
      userId: this.homeDashboardService.userId,
      title: this.addAlbumForm.controls['addedAlbum'].value,
      photos: []
    }
    this.homeDashboardService.addUserAlbum(albumBody).subscribe((data) => {
      this.userAlbums.push(data)
    }), (error) => {
      alert("An error has occured")
      alert(error)
    }
  }
  showUsersPhotos(album) {
    if (album.isChecked) {
      this.hideProgressBar = false;
      this.showPaginator = true;
      this.photoList = this.photoList.concat(album.photos);
      this.increaseProgressBar();
      this.pagedPhotoList = this.photoList.slice(((this.pageIndex) * (this.pageSize)), this.pageSize + (this.pageIndex) * (this.pageSize));
    } else {
      album.photos.forEach((photo) => {
        this.hideProgressBar = true;
        this.pagedPhotoList = []
        let i = -1;
        i = this.photoList.findIndex(userPhoto => photo.id === userPhoto.id);
        if (i !== -1) {
          this.photoList.splice(i, 1);
          i = -1;
        }
      });

      this.pageIndex = this.photoList.length / this.pageSize < this.pageIndex ? this.photoList.length / this.pageSize - 1 : this.pageIndex
      this.paginator.pageIndex = this.pageIndex;
      this.pagedPhotoList = this.photoList.slice(((this.pageIndex) * (this.pageSize)), this.pageSize + (this.pageIndex) * (this.pageSize));
    }
  }

  //show all albums in case the user checks the chekbox or not according to the input.checked value
  selectAll(input) {
    if (input.checked) {
      this.hideProgressBar = false;
      this.showPaginator = true;
      this.photoList = [];
      this.increaseProgressBar()
      this.userAlbums.forEach(album => {
        album.isChecked = true;
        this.photoList = this.photoList.concat(album.photos)
        this.pagedPhotoList = this.photoList.slice(((this.pageIndex) * (this.pageSize)), this.pageSize + (this.pageIndex) * (this.pageSize));
      });
    } else {
      this.hideProgressBar = true;
      this.showPaginator = false;
      this.photoList = [];
      this.pagedPhotoList = [];
      this.userAlbums.forEach(album => {
        album.isChecked = false;
      });
    }

  }
  showFormCard() {
    this.showFormCardFlag = true;
  }

  //increase progress bar loading
  increaseProgressBar() {
    var elem = document.getElementById("progress");
    var width = 10;
    var id = setInterval(frame);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
      } else {
        width++;
        elem.style.width = width + '%';
        elem.innerHTML = width * 1 + '%';
      }
    }
  }

  //a method that is executed when the user drops the selected album into the photos container
  onItemDrop(e: any) {
    this.droppedItems.push(e.dragData);
    this.userAlbums.splice(this.homeDashboardService.curruentClickedAlbumId, 1)
    this.isClickedOnDraggedItem = true;
    e.dragData.isChecked = true;
    this.showUsersPhotos(e.dragData);
  }
  getAlbumId(album) {
    this.homeDashboardService.curruentClickedAlbumId = album.id;
  }
  switchToDragAndDrop() {
    this.isDragAndDropView = true;
  }
  switchToNormalView() {
    this.isDragAndDropView = false;
  }
  showDraggableUsersPhotos(album) {
    this.homeDashboardService.currentSelectedAlbum = album;
  }
  removeDroppedAlbum(album, index) {
    this.droppedItems.splice(index, 1);
    this.userAlbums.push(album);
    album.isChecked = false;
    this.showUsersPhotos(album);
    this.hideProgressBar = true;
  }

  //a method that is executed when the user switches from page to page
  pageChange(e) {
    this.isClickedOnPagePaginator = true;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.pagedPhotoList = this.photoList.slice(((e.pageIndex) * (e.pageSize)), e.pageSize + (e.pageIndex) * (e.pageSize));
  }

  sortAlphapiticallyA_Z(a, b) {
    var textA = a.title[0].toUpperCase();
    var textB = b.title[0].toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  }

  sortAlphapiticallyZ_A(a, b) {
    var textA = a.title[0].toUpperCase();
    var textB = b.title[0].toUpperCase();
    return (textA < textB) ? 1 : (textA > textB) ? -1 : 0;
  }

  sortPhotosAZ() {
    this.isClickedOnAscending = true;
    this.isClickedOnDescendning = false;
    this.photoList.sort(this.sortAlphapiticallyA_Z);
    this.pagedPhotoList = this.photoList.slice(((this.pageIndex) * (this.pageSize)), this.pageSize + (this.pageIndex) * (this.pageSize));

  }
  sortPhotosZA() {
    this.isClickedOnDescendning = true;
    this.isClickedOnAscending = false;
    this.photoList.sort(this.sortAlphapiticallyZ_A);
    this.pagedPhotoList = this.photoList.slice(((this.pageIndex) * (this.pageSize)), this.pageSize + (this.pageIndex) * (this.pageSize));
  }
}
