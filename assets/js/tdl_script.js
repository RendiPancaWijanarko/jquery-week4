$(document).ready(function() {
    // Fungsi untuk menambahkan notifikasi
    function showNotification(message) {
        var notification = $('<div class="notification">' + message + '</div>');
        $('body').append(notification);

        // Hilangkan notifikasi setelah beberapa detik
        setTimeout(function() {
            notification.fadeOut(function() {
                $(this).remove();
            });
        }, 3000);
    }

    // Fungsi untuk memulai mode edit
    $('#taskList').on('dblclick', '.taskText', function() {
        var currentText = $(this).text();
        $(this).attr('contenteditable', 'true').focus();
        
        // Setelah editing selesai, simpan ke penyimpanan lokal
        $(this).on('blur', function() {
            var newText = $(this).text().trim();
            if (newText !== currentText) {
                saveTasksToLocalStorage(); // Menyimpan tugas setiap kali ada perubahan
            }
            $(this).removeAttr('contenteditable');
        });
    });

    // Fungsi untuk menambahkan tugas baru dengan animasi
    function addTask() {
        var taskText = $('#newTask').val().trim();
        var taskCategory = $('#taskCategory').val();
        if (taskText !== '' && taskCategory !== '') {
            // Tambahkan class "taskItem" untuk memudahkan styling
            var listItem = $('<li class="taskItem" style="display:none;"><div class="taskInfo"><span class="taskText">' + taskText + '</span><span class="category">' + taskCategory + '</span></div><div class="actions"><button class="markDone">Tandai Selesai</button><button class="delete">Hapus</button></div></li>');
            $('#taskList').append(listItem);
            listItem.fadeIn(); // Animasi fadeIn
            $('#newTask').val('');
            saveTasksToLocalStorage(); // Menyimpan tugas setiap kali ada perubahan
            showNotification('Tugas ditambahkan!');
        }
    }    

    // Fungsi untuk menyimpan tugas ke penyimpanan lokal
    function saveTasksToLocalStorage() {
        var tasks = $('#taskList').html();
        localStorage.setItem('tasks', tasks);
    }

    // Fungsi untuk memuat tugas dari penyimpanan lokal saat halaman dimuat
    function loadTasksFromLocalStorage() {
        var tasks = localStorage.getItem('tasks');
        if (tasks) {
            $('#taskList').html(tasks);
        }
    }

    // Menambahkan tugas saat tombol "Tambah" ditekan atau tombol "Enter" ditekan dalam input teks
    $('#addTask').click(addTask);

    $('#newTask').keypress(function(event) {
        if (event.key === 'Enter') { // Menggunakan "Enter" sebagai kunci
            addTask();
        }
    });

    // Menghapus tugas saat tombol "Hapus" ditekan
    $('#taskList').on('click', '.delete', function() {
        $(this).closest('li').fadeOut(function() {
            $(this).remove();
            saveTasksToLocalStorage(); // Menyimpan tugas setiap kali ada perubahan
            showNotification('Tugas dihapus!');
        });
    });

    // Menandai tugas sebagai selesai saat tombol "Tandai Selesai" ditekan
    $('#taskList').on('click', '.markDone', function() {
        var listItem = $(this).closest('li');
        listItem.toggleClass('completed');
        saveTasksToLocalStorage(); // Menyimpan tugas setiap kali ada perubahan
        showNotification('Tugas ditandai selesai!');
    });

    // Mengurutkan tugas berdasarkan teks atau kategori
    $('#sortTasks').change(function() {
        var sortType = $(this).val();
        var tasks = $('#taskList li').get();

        tasks.sort(function(a, b) {
            var keyA, keyB;

            if (sortType === 'text') {
                keyA = $(a).find('.taskText').text().toUpperCase();
                keyB = $(b).find('.taskText').text().toUpperCase();
            } else if (sortType === 'category') {
                keyA = $(a).find('.category').text().toUpperCase();
                keyB = $(b).find('.category').text().toUpperCase();
            }

            return (keyA < keyB) ? -1 : (keyA > keyB) ? 1 : 0;
        });

        // Menghapus semua tugas dari daftar
        $('#taskList').empty();

        // Menambahkan tugas yang sudah diurutkan kembali
        $.each(tasks, function(index, task) {
            $('#taskList').append(task);
        });

        saveTasksToLocalStorage(); // Menyimpan tugas setiap kali ada perubahan
        showNotification('Tugas diurutkan!');
    });

    // Panggil fungsi untuk memuat tugas saat halaman dimuat
    loadTasksFromLocalStorage();

    // Aktifkan kode berikut untuk menghapus local storage
    // localStorage.clear();
});
