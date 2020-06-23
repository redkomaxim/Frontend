window.onload = function()
{
    var info;
    var Ajax = new XMLHttpRequest();
    Ajax.open('GET', 'https://randomuser.me/api/?results=10', true);
    Ajax.send();
    
    Ajax.onload = function()
    {
    info = JSON.parse(Ajax.responseText);
    document.getElementById('load').remove();
    UserInfo(info);
    document.querySelector('#chart').addEventListener('click', () => 
    {
    document.querySelector('#popupChart').className = "popupCont";
    ShowChart(info);
    });
    document.querySelector('#popupExit').addEventListener('click', () => 
    {
    document.querySelector('#popupChart').className += " invisibly";
    });
    document.querySelector('#search').addEventListener('keyup', () => SearchUser());
    }
}
  
    function UserInfo(info)
    {
      var Avatar, BiggerAvatar, Lastname, Firstname, Username, Gender, Registered, Email, Address, AddressNumber, City, ZipCode, Birthday, Phone, Cell, Location;
      for (var i = 0; i < info.results.length; i++) 
      {
        Avatar = info.results[i].picture.thumbnail;
        BiggerAvatar =  info.results[i].picture.large;
        Lastname = info.results[i].name.last;
        Firstname = info.results[i].name.first; 
        Username = info.results[i].login.username;
        Gender = info.results[i].gender;
        Registered = info.results[i].registered.date.slice(0, 10).split('-').reverse().join('/');
        Email = info.results[i].email;
        City = info.results[i].location.city;
        Address = info.results[i].location.street.name;
        AddressNumber = info.results[i].location.street.number;
        ZipCode = info.results[i].location.postcode;
        Birthday = info.results[i].dob.date.slice(0, 10).split('-').reverse().join('/');
        Phone = info.results[i].phone;
        Cell = info.results[i].cell;
        Location = info.results[i].location.state.split(/\s+/).map(word => word[0].toUpperCase() + word.substring(1)).join(' '); 
        AddUsers(Avatar, BiggerAvatar, Lastname, Firstname, Username, Gender, Registered, Email, Address, AddressNumber, City, ZipCode, Birthday, Phone, Cell, Location, i);
      }
    }

    function AddUsers(Avatar, BiggerAvatar, Lastname, Firstname, Username, Gender, Registered, Email, Address, AddressNumber, City, ZipCode, Birthday, Phone, Cell, Location, i)
    {
      var ListUser = document.querySelector('#userList');
      var User = document.createElement('tr');
      User.className = "user";
      User.innerHTML = `<td><img src = ${Avatar} alt = ${Firstname + ' ' + Lastname}></td>
                        <td>${Lastname}</td>
                        <td>${Firstname}</td>
                        <td>${Username}</td>
                        <td>${Phone}</td>
                        <td>${Location}</td>
                        <td><a className = "" href="#" onClick = "showDetails(this.parentNode.parentNode.nextSibling)">+</a></td>`;
                        ListUser.appendChild(User);
                        var UserMoreInfo = document.createElement('tr');
      UserMoreInfo.className = "invisibly";
      UserMoreInfo.innerHTML = `<td colSpan="9">
                                 <div><div><ul>
                                   <h2>${Lastname + ' ' + Firstname}</h2>
                                   <h2><b>Gender: </b><span>${Gender}</span></h2>
                                   <li><b>Username: </b><span>${Username}</span></li>
                                   <li><b>Registered: </b><span>${Registered}</span></li>
                                   <li><b>Email: </b><span>${Email}</span></li>
                                 </ul></div>
                                 <div><ul>
                                   <li><b>Address: </b><span>${`${AddressNumber} ${Address}`}</span></li>
                                   <li><b>City: </b><span>${City}</span></li>
                                   <li><b>Zip Code: </b><span>${ZipCode}</span></li>
                                 </ul></div>
                                 <div><ul>
                                   <li><b>Birthday: </b><span>${Birthday}</span></li>
                                   <li><b>Phone: </b><span>${Phone}</span></li>
                                   <li><b>Cell: </b><span>${Cell}</span></li>
                                 </ul></div>
                                 <div><img src=${BiggerAvatar} alt=${Firstname + ' ' + Lastname}></div></div></td>`;
                                 ListUser.appendChild(UserMoreInfo);
      if(i % 2 == 0) 
      {
        User.style.backgroundColor = "#c2c2c2";
        UserMoreInfo.style.backgroundColor = "#c2c2c2";
      }
    }
  
    function showDetails(user) 
    {
      if(document.querySelector('.drop') != null && user.previousSibling.lastChild.lastChild.textContent != '-') 
      {
        document.querySelector('.drop').previousSibling.lastChild.lastChild.innerText = "+";
        document.querySelector('.drop').className = "invisibly";
        user.previousSibling.lastChild.lastChild.innerText = "-";
        user.className = "drop";
      } 
      else if(user.previousSibling.lastChild.lastChild.textContent == '-') 
      {
        user.previousSibling.lastChild.lastChild.innerText = "+";
        user.className = "invisibly";
      } 
      else 
      {
        user.previousSibling.lastChild.lastChild.innerText = "-";
        user.className = "drop";
      }
    }
  
    function SearchUser()
    {
      var name = document.getElementById('search');
      var userList = document.getElementById('userList');
      var userFind = new RegExp(name.value, 'i');
      var flag = false;
        for (var i = 1; i < userList.rows.length; i++) 
        {
          flag = false;
          for (var j = userList.rows[i].cells.length - 1; j >= 0; j--) 
          {
            if (j != 1 && j != 2) continue;
            flag = userFind.test(userList.rows[i].cells[j].innerHTML);
            if (flag) break;
          }
          if (flag) 
          {
            userList.rows[i].style.display = "";
          } 
          else 
          {
            userList.rows[i].style.display = "none";
          }
        }
      }

      function ShowChart(info) 
      {
        function SearchValue(gen) 
        {
          var count = 0;
          for (var i = 0; i < info.results.length; i++) 
          {
            if(info.results[i].gender == gen) 
            count++;
          }
          return count;
        }
        var result = [
                       {gen: 'Male', color: 'LightCyan', value: SearchValue('male')},
                       {gen: 'Female', color: 'Lavender', value: SearchValue('female')}
                      ];
        var total = (() => 
        {
          var total = 0;
          for(i in result) 
          {
            total += result[i].value;
          }
          return total;
        })(); 
        var graph = document.querySelector('#GenderUsers').getContext('2d');
        graph.font = '16px Times New Roman';
        var actualAngle = -0.5 * Math.PI;
        var centerX = 310;
        var centerY = 150;
        result.forEach((result) => 
        {
          var sliceAngle = (result.value / total) * 2 * Math.PI;
          var middleAngle = actualAngle + 0.5 * sliceAngle;
          graph.beginPath();
          graph.arc(centerX, centerY, 100, actualAngle, actualAngle + sliceAngle);
          actualAngle += sliceAngle;
          graph.lineTo(centerX, centerY);
          graph.fillStyle = result.color;
          graph.fill();
          if (middleAngle < - 0.5 * Math.PI || middleAngle > 0.5 * Math.PI)
          {
            graph.textAlign = 'right';
          } 
          else 
          {
            graph.textAlign = 'left';
          }
          graph.textBaseline = 'middle';
          graph.fillText(`${result.gen} ${total / 1 * result.value}%`, Math.cos(middleAngle) * 120 + centerX, Math.sin(middleAngle) * 120 + centerY);
        });
      }