let estudiantes = [];
let idgrupo;

function agregarEstudiante() {
    // Validación de si se ha seleccionado un estudiante
    if ($("#estudiante").prop("selectedIndex") === 0) {
        alert("Debe seleccionar un estudiante");
        return;
    }

    // Validación de si el estudiante ya existe
    if (validarEstudianteExiste()) {
        alert("El estudiante ya ha sido agregado.");
        return;
    }

    estudiantes.push({
        idestudiante: $("#estudiante").val(),
        nombrecompleto: $("#estudiante option:selected").text().trim(),
        idgrupo: $("#idgrupo").val()
    });

    mostrarEstudiantes();
}

function mostrarEstudiantes() {
    let contenido = $("#contenido_tabla");
    let data = $("#data");

    contenido.empty();
    data.empty();

    if (estudiantes.length > 0) {
        estudiantes.forEach((estudiante, index) => {
            contenido.append("<tr>");
            contenido.append("<td>" + estudiante.idestudiante + "</td>");
            contenido.append("<td>" + estudiante.nombrecompleto + "</td>");
            contenido.append("<td><a class='btn btn-danger' href='#' onclick='eliminarEstudiante(event, " + index + ")'>Eliminar</a></td>");
            data.append("<input type='hidden' name='grupo_estudiantes[" + index + "][idgrupo]' value='" + estudiante.idgrupo + "'/>");
            data.append("<input type='hidden' name='grupo_estudiantes[" + index + "][idestudiante]' value='" + estudiante.idestudiante + "'/>");
        });
    } else {
        contenido.append("<tr><td colspan='3' style='text-align: center'>No hay información.</td></tr>");
    }

    data.append("<input type='hidden' name='idgrupo' value='" + $("#idgrupo").val() + "'/>");
}

function validarEstudianteExiste() {
    return estudiantes.some(est => est.idestudiante === $("#estudiante").val());
}

function eliminarEstudiante(event, index) {
    event.preventDefault();
    estudiantes.splice(index, 1);
    mostrarEstudiantes();
}
