

$(window).on("load", function () {
    // $("#rezervace").modal("show")

    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })
    $(function () {
        $('[data-toggle="popover"]').popover()
    });

    $(function () {
        zaplatit()
        tlacitkaBook()
        $("#prijezd0").attr("min", today())
        $("#odjezd0").prop("min", tomorrow())
        $("#prijezd0").attr("value", today())
        $("#odjezd0").prop("value", tomorrow())
        let pocetPokoju = 1

        $("#prijezd0").on("change", function(){
            $("#odjezd0").prop("min", nextDay())
            $("#odjezd0").prop("value", nextDay())
            
        })
        $("#pridej-pokoj0").on("click", function () {
            let pokoj = $("#pokojOsob0").clone(true)

            pokoj.attr("id", "pokojOsob" + pocetPokoju)
            pokoj.find("#typ-pokoje0").attr("id", "typ-pokoje" + pocetPokoju)
            pokoj.find("#pocet-osob0").attr("id", "pocet-osob" + pocetPokoju)

            pokoj.find("#prijezd0").attr("id", "prijezd" + pocetPokoju)
            pokoj.find("#odjezd0").attr("id", "odjezd" + pocetPokoju)

            pokoj.find("#pridej-pokoj0").attr("id", "pridej-pokoj" + pocetPokoju)
            pokoj.find("#odeber-pokoj0").prop("disabled", false)
            pokoj.find("#odeber-pokoj0").attr("style", "pointer-events:auto; width:50px;")
            pokoj.find("#odeber-pokoj0").attr("id", "odeber-pokoj" + pocetPokoju)
            $(pokoj).insertAfter($(this).parent().parent().parent())
            pocetPokoju++
        })
        $("#odeber-pokoj0").on("click", function () {
            // let pokoj = $("#pokojOsob").clone(true)
            $(this).parent().parent().parent().parent().remove()
            $("#odeber-pokoj0").parent().tooltip("hide")

        })
        $("#rezervovat").on("click", function () {
            vytvorModal()
        })
        $("#modal-storno").on("click", function () {
            $("#rezervace").modal("hide")

        })
        function zaplatit(){
            $("#modal-zaplatit").on("click", function(){
                $('html,body').scrollTop(0);
                $("#rezervace").modal("hide")
                $("#loading").removeClass("d-none")
                setTimeout(function(){ $("#loading").addClass("d-none") }, 3000);
                setTimeout(function(){ $("#modal-zaplaceno").modal("show") }, 3000);
                $("[id^='pokojOsob']:gt(0)").remove();
            })
        }
        function tlacitkaBook() {
            let tlacitka = $("[data-typ]")
            for(let tlacitko of tlacitka){
                $(tlacitko).on("click", function(){
                    $("#typ-pokoje0").prop("value", $(this).attr("data-typ"))
                })
            }
        }
        function vycistiModal() {
            $("#modal-poznamka").text("")
            $("#poznamka").prop("value", "")
            $("[id^='modal-souhrn']").remove();
        }
        $('#rezervace').on('hidden.bs.modal', function () {
            vycistiModal()
        })

        function vytvorModal() {
            if ($("#jmeno").prop("value") && (ValidateEmail())) {
                $("#email").addClass("border-success")
                $("#jmeno").addClass("border-success")
                $("#modal-jmeno").text($("#jmeno").prop("value"))
                $("#modal-email").text($("#email").prop("value"))
                spocitejCenu()
                $("#rezervace").modal("show")
            }
            else {
                $("#jmeno").prop("value") ? $("#jmeno").addClass("border-success") : $("#jmeno").addClass("border-primary")
                ValidateEmail() ? $("#email").addClass("border-success") : $("#email").addClass("border-primary")
                if(!$("#jmeno").prop("value")) $("#jmeno").focus()
                else if(!ValidateEmail()) $("#email").focus()

            }
        }
        function ValidateEmail() {
            if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test($("#email").prop("value"))) {
                return (true)
            }
            return (false)
        }

        function spocitejCenu() {
            let pokoje = $("[id^='pokojOsob']")
            let cenaCelkem = 0;
            for (let pokoj of pokoje) {
                let cena = 0;
                let cislo = $(pokoj).attr("id")
                cislo = cislo[cislo.length - 1]
                let typPokoje = $("#typ-pokoje" + cislo).prop("value")
                let pocetOsob = $("#pocet-osob" + cislo).prop("value")
                let prijezd = new Date($("#prijezd" + cislo).prop("value"))
                let odjezd = new Date($("#odjezd" + cislo).prop("value"))
                let pocetDni = (odjezd - prijezd) / (1000 * 3600 * 24)

                switch (typPokoje) {
                    case "low-cost":
                        cena = 800;
                        break;
                    case "standart":
                        cena = 1000;
                        break;
                    case "superior":
                        cena = 1500;
                        break;
                    case "suite":
                        cena = 2500;
                        break;
                }
                switch (pocetDni) {
                    case 1:
                        cena = cena;
                        break;
                    case 2:
                        cena = cena * 0.9;
                        break;
                    default:
                        cena = cena * 0.8;
                        break;
                }

                cena = pocetOsob == 1 ? cena = (cena * 0.75) : cena = cena
                let cenaNoc = cena

                cena = cena * pocetDni

                let vypis = $("#souhrn").clone(true)
                $(vypis).removeClass("d-none")
                $(vypis).find("#modal-typPokoje").text(typPokoje)
                $(vypis).find("#modal-pocetOsob").text(pocetOsob)
                $(vypis).find("#modal-pocetDni").text(pocetDni)

                $(vypis).find("#modal-prijezd").text($("#prijezd" + cislo).prop("value"))
                $(vypis).find("#modal-odjezd").text($("#odjezd" + cislo).prop("value"))
                $(vypis).find("#modal-cenaNoc").text(cenaNoc + "Kc")
                $(vypis).find("#modal-cenaPokoj").text(cena + "Kc")
                $(vypis).insertBefore($("#modal-poznamka").parent())
                vypis.attr("id", "modal-souhrn" + cislo)


                cenaCelkem += cena;
                $("#modal-cenaCelkem").text(cenaCelkem + "Kc")
                
            }
            $("#modal-poznamka").text($("#poznamka").prop("value"))
        }
        function today() {
            var today = new Date();
            console.log(today)

            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            today = yyyy + '-' + mm + '-' + dd;
            return today;
        }
        function tomorrow() {
            var today = new Date()
            var tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)
            var dd = String(tomorrow.getDate()).padStart(2, '0');
            var mm = String(tomorrow.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = tomorrow.getFullYear();
            tomorrow = yyyy + '-' + mm + '-' + dd;
            return tomorrow;
        }
        function nextDay() {
            var today = new Date($("#prijezd0").prop("value"))
            var tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)
            var dd = String(tomorrow.getDate()).padStart(2, '0');
            var mm = String(tomorrow.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = tomorrow.getFullYear();
            tomorrow = yyyy + '-' + mm + '-' + dd;
            console.log(tomorrow)
            return tomorrow;
        }

    })
})
