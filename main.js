/* 
資料: 景點詳細資料、高雄各區域名稱
*/
const sitesData = get_openData(); //高雄旅遊景點資訊集合
const areaNames = Array.from(
    new Set(
        sitesData.map(item => {
            //旅遊景點所在地: 用map取得所有Zone的名稱, 再由from, new Set刪除重複的名稱
            return item.Zone;
        })
    )
);


/*
本文開始
*/

//生成網頁最上方的地區選單
let areaDropdown = document.querySelector("#area_names");
let optionHeader = `
    <option>-- 請選擇地區 --</option>
    <option>-- 可以免費參觀的景點 --</option> `;
const options = areaNames.map(item => {
    const str = `<option>${item}</option>`;
    return str;
});
areaDropdown.innerHTML = optionHeader + options;


/*
事件
*/

//下拉式選單, 取得選區的區域、
areaDropdown.addEventListener('change', renderData);


/*
functions 
*/

//取得下拉式選單的值
function getSelected() {
    const selected = areaDropdown.value;
    let option = {
        title: selected,
        filtered: []
    };


    //篩選出可以免費參觀的景點
    if (selected == '-- 可以免費參觀的景點 --') {
        option.title = '可以免費參觀的景點';
        const filteredArray = sitesData.filter(item => {
            return item.Ticketinfo == "免費參觀";
        });
        // console.log(filteredArray)
        option.filtered = filteredArray;
    }

    //篩選出選取的地區
    if (selected !== '-- 請選擇地區 --' && selected !== '-- 可以免費參觀的景點 --') {
        const filteredArray = sitesData.filter(item => {
            return item.Zone == selected;
        });
        // console.log(filteredArray)
        option.filtered = filteredArray;
    }

    return option;
}

//渲染篩選後的資料到網頁上
function renderData() {
    //DOM
    const selected = getSelected(); //ob{area, content: 篩選的資料}
    let dataArr = selected.filtered;
    const selectedTitle = selected.title;
    let str = '';

    // console.log(dataArr)

    document.querySelector('.selected-name').textContent = selectedTitle;

    //組合字串
    dataArr.forEach(item => createElements(item));

    function createElements(e) {
        const bgImg = `background-image: url('${e.Picture1}')`;
        const icons = {
            time: `<i class="fas fa-clock"></i>`,
            add: `<i class="fas fa-map-marker-alt"></i>`,
            tel: `<i class="fas fa-mobile-alt"></i>`,
            tag: `<i class="fas fa-tag"></i>`
        };

        const template = `
            <li class="shown-item">
                <h3 class="title" style="${bgImg}">
                    <div class="title-content">
                        <h3>${e.Name}</h3>
                        <span>${e.Zone}</span>
                    </div>
                </h3>
                <p class="item-content">
                    <span>${icons.time + e.Opentime}</span>
                    <span>${icons.add + e.Add}</span>
                    <span>${icons.tel + e.Tel}</span>
                    <em>${icons.tag + e.Ticketinfo}</em>
                </p>
            </li>   
        `;
        str += template;
        document.querySelector('.show-case').innerHTML = str;
    };

}

//取得open data
function get_openData() {
    const request = new XMLHttpRequest();
    //連結網址 .open(三個參數)
    request.open("get", "https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97", false);
    //送出請求
    request.send(null);

    // const data = request.response.result.records;
    const response = JSON.parse(request.responseText);
    // console.log(response.result.records);
    return response.result.records;
}