/**
 *
 *
 *
 */

var CSR_TEMPLATE = '<li class="performance__item"> \
  <div class="csr clearfix"> \
    <img class="csr__photo" src="{{pictureUrl}}"> \
    <div class="csr__name"> \
      <h4>{{csrName}}</h4> \
    </div> \
    <div class="csr__solves"> \
      <h4>{{totalSolves}}</h4> \
    </div> \
  </div> \
</li>';


function fetchData() {
  $.ajax({
    url: 'api/v1/ticket/solved?groupBy=csr&solvedDate=today',
    dataType: 'json',
    success: loadToDom
  });
}


function loadToDom(response) {
  var htmlTemplate = transformData(response);

  // Append to DOM
  $('#team__performance').empty().append(htmlTemplate);
}


function transformData(response) {
  var rawData = response['entities'];
  var htmlData = [];

  rawData.forEach(function(elem) {
    var htmlElem = CSR_TEMPLATE.replace('{{pictureUrl}}', elem.picture_url);
    htmlElem = htmlElem.replace('{{csrName}}', elem.full_name);
    htmlElem = htmlElem.replace('{{totalSolves}}', elem.total_solves);

    htmlData.push(htmlElem);
  });

  var htmlTemplate = htmlData.slice(0, 6).join('');
  return htmlTemplate;
}


/**
 *
 *
 *
 */

function fetchChartData() {
    $.ajax({
      url: '/api/v1/ticket/solved?groupBy=date&solvedDate=last_5_days',
      dataType: 'json',
      success: loadChartData
    });
}


function loadChartData(response) {
  var data;
  if (response.hasOwnProperty('entities')) {
    data = response['entities'];
  }

  for (var i = 0, n = data.length; i < n; i++) {
    var element = data[i];
    element['x'] = element['date_solved'];
    element['y'] = element['total_solves'];
  }

  initCustomLineChart(data);
}


/**
 *
 *
 *
 */

function fetchTotalData() {
  $.ajax({
    url: '/api/v1/ticket/solved?groupBy=date&solvedDate=today',
    dataType: 'json',
    success: loadTotalData
  });
}


function loadTotalData(response) {
  var data;
  if (response.hasOwnProperty('entities')) {
    data = response['entities'];
  }

  var total;
  if (data.length) {
    total = data[0]['total_solves'];
  } else {
    total = 0;
  }

  $('#total__solves').empty().text(total);
}
