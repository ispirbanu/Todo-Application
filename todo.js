//elementlerin seçimi
const form=document.querySelector("#todo-form");
const todoinput=document.querySelector("#todo");
const todolist=document.querySelector(".list-group");
const firstCardbody=document.querySelectorAll(".card-body")[0];
const secondCardbody=document.querySelectorAll(".card-body")[1];
const filter=document.querySelector("#filter");
const clearButton=document.querySelector("#clear-todos");

firstCardbody.appendChild(document.createElement("br"));
eventListeners();

function eventListeners(){ //tüm yapılacak eventlistener olayları için 
    form.addEventListener("submit",addTodo);
    document.addEventListener("DOMContentLoaded",loadAllTodos); //sayfa yüklendiğinde todoları yüklemek
    //DOMContendLoaded- stil sayfaları, resimlerin yüklenmesini bitirmesini beklemeden belge 
    //tamamen yüklendiğinde ve ayrıştırıldığında tetiklenir(load- yalnızca HTML değil tüm dış kaynaklar yüklenir. resimler stiller vb)

    secondCardbody.addEventListener("click",deleteTodo); //event Capturing mantığı
    filter.addEventListener("keyup",filterTodos); //todo filtreleme 
    //keydown keyup vs kullanılabilir. 
    //keydown silme işlemi yapıldığında todoların tekrar yüklenmesi için tekrar silme tuşuna vs basmayı bekliyor.


    clearButton.addEventListener("click",clearAlltodos);//tüm todoları silmek

}


//todo eklemek
function addTodo(e){
    const newTodo=todoinput.value.trim(); //girilen todo adını almak
    let gettodos=getTodosFromStorage(); //storage da bulunan todolar
    if(newTodo===""){
        //alert("Boş Todo eklenemez"); 

        //boostrap alertlerini kullanırsak
        // firstCardbody.appendChild(document.createElement("br"));
        // const alert=document.createElement("div");
        //alert.className="alert alert-danger";
        // alert.role="alert";
        // alert.innerHTML="<strong> Uyarı! </strong>";
        // alert.appendChild(document.createTextNode("Bu alanı boş geçemezsiniz"));
        // firstCardbody.appendChild(alert);

        //fonksiyon üzerinde 
        //showAlert("Lütfen bir todo girin");
        showAlert("danger","Lütfen bir todo girin.");
    }
    if(gettodos.indexOf(newTodo)!=-1){ //önceden varsa uyarı gösterilecek
        showAlert("warning","Bu todo zaten kayıtlı");
    }
    else{
        addTodoUI(newTodo); 
        addTodoStorage(newTodo); //todo'yu storage ekleme
        showAlert("success","Todo eklendi.");
    }
    e.preventDefault(); //sayfanın yenilenmemesi için
}

//Todo filtreleme
function filterTodos(e){ //bu fonksiyon çalıştırıldığında bulunamayan todolar kaybolmuyor
    //bunun nedeni boostrap 
    //class içerisindeki d-flex display özelliğini baskılıyor. bunun için css de bulunan !important özelliği kullanılıyor
    

    //e.target.value keydown olayında yazılan girilen değer
    const filtervalue= e.target.value.toLowerCase(); //girilen değer alındı
    const listitems=document.querySelectorAll(".list-group-item"); //todoların bulunduğu bütün li değerleri alındı
    listitems.forEach(function(item){
        const text=item.textContent.toLowerCase(); //li içerisindeki texti alarak aramının uyuşması için 
        //ikisinde de lowercase kullanıldı.
        if(text.indexOf(filtervalue)===-1){ //aranan değer todolardan geçmiyorsa yani bulunamadıysa indexOf -1 döner
            item.setAttribute("style","display: none !important"); //bulunamadıysa bunu göstermemesi için display özelliği ekleyerek
            //bu özelliğe none atayarak görünmemesi sağlandı
            //!important kullanımı baştaki açıklamada
        }
        else{
            item.setAttribute("style","display: block");//arama bulunduysa göstermesi için display özelliği block olarak atandı
        }
    });
}


//seçilen todoları arayüzden silmek
function deleteTodo(e){ 
    if(e.target.className==="fa fa-remove"){ // sadece silme butonuna tıklandıysa
        //console.log("silme işlemi")
        //Silme işlemi yaparken i den onun parentı a ya ve sonra onun parenti li ye ulaşmak gerekiyor
        // <li class="list-group-item d-flex justify-content-between">
        //  Todo 1
        //  <a href = "#" class ="delete-item">
        //  <i class = "fa fa-remove"></i>
        if(confirm(e.target.parentElement.parentElement.textContent+" isimli todo silinecek")){
            e.target.parentElement.parentElement.remove();
            deleteTodoStorage(e.target.parentElement.parentElement.textContent);
            showAlert("success","Todo silindi");
        }
        
    }
}
//todoları LocolStorage dan silme
function deleteTodoStorage(deletetodoName){
    let todos=getTodosFromStorage(); //storage üzerindeki todo elementleri
    todos.forEach(function(todo,index){
        if(todo===deletetodoName){
            todos.splice(index,1); //arrayden istenilen todo silindi.
        }
    });
    localStorage.setItem("todos",JSON.stringify(todos)); //local storage a tekrardan güncellenen array yazılır.

}

//tüm taskları temizleme butonuyla tüm todoları silmek
function clearAlltodos(e){

    if(confirm("Tümünü silmek istediğinize emin misiniz?")){
        //arayüzden kaldırma
        //todolist.innerHTML=""; // ul etiketinin tamamını temizler.
        //yavaş bir yol

        //console.log(todolist.firstElementChild);
       //todolist.removeChild(todolist.firstElementChild);//ilk elemanı -çocuğu silecek.
        //bu işlem hiç çocuk kalmayana kadar devam edilirse null değer alınır.
        

        //innerHTML den daha hızlı çalışır- büyük projeler için daha uygun yol
        while(todolist.firstElementChild !=null){ //null olana kadar işlem devam edecek
            todolist.removeChild(todolist.firstElementChild);
        }
        localStorage.removeItem("todos"); //tüm todoları localstorage üzerinden silinecek.

    }
    

}




//sayfa yüklendiğinde todoları sayfaya yüklemek.
function loadAllTodos(){
    let todos=getTodosFromStorage();
    todos.forEach(function(todo){
        addTodoUI(todo); //arayüze eklemeyi yapan fonksiyon (addTodoUI) çağırılacak.
    });
}

//Local storage içerisindeki todolar
function getTodosFromStorage(){ // storage içerisinden todoları alma  
    let todos;
    if(localStorage.getItem("todos")===null){ //array yoksa boş bir array oluşturuyoruz.
        todos=[];
    }
    else{
        todos=JSON.parse(localStorage.getItem("todos")); //string olarak yazıldığından bunu bir arraye çevirmek için
        //JSON.parse kullanıldı
    }
    return todos;
}

function addTodoStorage(newTodo){ //todoları eklemek
    let todos=getTodosFromStorage(); //olan todoları almak
    todos.push(newTodo); //ekleme işlemi
    localStorage.setItem("todos",JSON.stringify(todos)); //arrayleri string hale çevirmek.
}



function showAlert(type,message){
    const alert=document.createElement("div");
    //alert.setAttribute("class",`alert alert-${type}`);
    alert.className= `alert alert-${type}`; //type olarak gelen sınıf kullanılacak ör: danger kırmızı, success yeşil
    alert.textContent=message;
    firstCardbody.appendChild(alert);

    //uyarıyı gösterdikten sonra belli bir süre içerisinde silmek 
    setTimeout(function(){
        alert.remove(); //2 saniye sonra bu fonksiyon çalışacak
    },2000);
}

function addTodoUI(newTodo){ //arayüze todo ekleme 
    //oluşturulacak todo yapısı
    // <li class="list-group-item d-flex justify-content-between">
    //     Todo 1
    //     <a href = "#" class ="delete-item">
    //         <i class = "fa fa-remove"></i>
    //     </a> 
    // </li>

    //list item oluşturma
    const listitem=document.createElement("li");
    listitem.className="list-group-item d-flex justify-content-between";
  
    //link (a) elementini oluşturmak 
    const link= document.createElement("a");
    link.href="#";
    link.class="delete-item";
    link.innerHTML="<i class = 'fa fa-remove'></i>"; 

    listitem.appendChild(document.createTextNode(newTodo)); //Gelen ismi todoya eklemek
    listitem.appendChild(link); //linki (a) li etiketine eklemek
    //Todo liste (ul)  list item ekleme (li) 
    todolist.appendChild(listitem);

    //console.log(listitem);
    todoinput.value=""; //input alanının içerisini temizleme;
}