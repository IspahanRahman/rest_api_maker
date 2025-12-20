import Swal, {
    SweetAlertOptions,
    SweetAlertResult,
} from 'sweetalert2'

export const CustomSwal: typeof Swal = Swal.mixin({
    customClass: {
        container: 'backdrop-blur-[2px]',
        popup: 'swal-theme', // marker class
        title: 'text-h5 font-semibold',
        htmlContainer: 'text-sm',
        actions: 'gap-2',
        confirmButton: 'swal2-confirm',
        cancelButton: 'swal2-cancel',
        input: ''
    },
    buttonsStyling: true,
    allowOutsideClick: true,
    allowEscapeKey: true
})

export const DangerSwal: typeof Swal = Swal.mixin({
    customClass: {
        container: 'backdrop-blur-[2px]',
        popup: 'swal-theme',
        title: 'text-h5 font-semibold',
        htmlContainer: 'text-sm',
        actions: 'gap-2',
        confirmButton: 'swal2-confirm swal2-styled-danger',
        cancelButton: 'swal2-cancel',
        input: ''
    },
    buttonsStyling: true,
    allowOutsideClick: true,
    allowEscapeKey: true
})
