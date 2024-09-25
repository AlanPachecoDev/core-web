<template >
    <div class="visibleArea">


        <v-card class="cardList">
            <div class="cardHeader">
                <h2>List of users</h2>
            </div>
            <div class="headerOptions">
                <div class="headerOptionsLeft">
                    <div class="input-container">
                        <input type="text" required="" v-model="buscar" />
                        <label>Search by name</label>
                    </div>
                </div>
                <div class="headerOptionsRight">
                    <div class="containerBtn">
                        <p>New</p>
                        <i @click="goToNewUser()" class="mdi mdi-plus-box mdi-36px iconBtn"></i>

                    </div>

                </div>

            </div>
            <div v-if="loading">Loading...</div>
            <v-table v-if="!loading" class="tableList">
                <thead>
                    <tr>
                        <td>
                        <th class="text-left">Name</th>
                        </td>
                        <td>
                        <th class="text-left">Surname</th>
                        </td>
                        <td>
                        <th class="text-left">Email</th>
                        </td>
                        <td>
                        <th class="text-left">City</th>
                        </td>
                        <td>
                        <th class="text-left">Birthdate</th>
                        </td>
                        <td>

                        </td>
                        <td>

                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(user, index) in usersToShow" :key="index">
                        <td>{{ user.name }}</td>
                        <td>{{ user.surname }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.city }}</td>
                        <td>{{ user.birthdate }}</td>
                        <td>
                            <i class="mdi mdi-account-edit mdi-36px iconBtn" @click="goToEditUser(user.uid)"></i>
                        </td>
                        <td>
                            <i class="mdi mdi-account-remove mdi-36px iconBtn" @click="deteleUser(user.uid)"></i>
                        </td>
                        <td>
                            <i class="mdi mdi-chart-line mdi-36px iconBtn" @click="viewStatistics(user.uid)"></i>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-card>
    </div>
</template>
  
<style></style>

<script>
//Función que retorna los usuarios registrados
import { getUsers, deleteUser } from '../../../controllers/usersController';

export default {
    data() {
        return {
            buscar: "",
            users: [],
            usersToShow: [],
            loading: true
        };
    },
    watch: {
        buscar(newValue, OldValue) {
            const newUsers = this.users.filter((user) => {
                if (user.name.toLowerCase().includes(newValue.toLowerCase())) {
                    return user;
                }
            });
            this.usersToShow = newUsers;
        }
    },
    methods: {
        viewStatistics(id){
            this.$router.push({ name: "viewStatistics", params: { id } });
        },
        goToNewUser() {
            this.$router.push('/admin/new');
        },
        goToEditUser(id) {
            this.$router.push({ name: "editUser", params: { id } });
        },
        deleteUserOfList(id) {
            this.users = this.users.filter((user) => {
                if (user.uid != id) {
                    return user;
                }
            });

            this.usersToShow = Object.assign({}, this.users);
        },
        async deteleUser(id) {

            const result = await this.$swal({
                title: '¿Do you want to delete this user?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: "Not",
            });
            if (result.isConfirmed) {
                const res = await deleteUser(id);

                if (res) {
                    await this.$swal({
                        title: "¡User deleted successfully!",
                        icon: "success",
                        showCancelButton: false,
                        confirmButtonText: "OK",
                    });
                    location.reload();
                } else {
                    await this.$swal({
                        title: "¡An error ocurred when deleting user!",
                        icon: "error",
                        showCancelButton: false,
                        confirmButtonText: "OK",
                    });
                }
            }
        }
    },
    async mounted() {
        //Usamos el controlador
        const us = await getUsers();

        if (us) {
            this.users = us;
            this.usersToShow = Object.assign({}, this.users);
            this.loading = false;
        }
    }
}
</script>