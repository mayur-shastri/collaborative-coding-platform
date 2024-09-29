import { ArrowRight } from 'lucide-react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { instance as configuredAxios } from '../../axiosConfig';
import Typography from '@mui/material/Typography'
import AuthAnimation from './Animations/AuthAnimation';
import { useContext } from 'react';
import FlashContext from '../../context providers/Flash/FlashContext';
import FlashCard from '../../components/FlashCard/FlashCard';

export default function Register() {

    const navigate = useNavigate();
    const { isVisible, setIsVisible, setFlashType, setFlashMessage } = useContext(FlashContext);
    const { register, watch, formState: { errors }, handleSubmit } = useForm();

    const watchedUsername = watch("username");
    const watchedPassword = watch("password");
    const watchedEmail = watch("email");

    const submitForm = async () => {
        try {
            const res = await configuredAxios.post('/register',
                {
                    username: watchedUsername,
                    email: watchedEmail,
                    password: watchedPassword
                });
            console.log(res.data.message);
            if (res.data.message === 'Registered Successfully!') {
                console.log(res);
                console.log(res.data);
                navigate('/app/home');
            }
            setFlashType(res.data.flashType);
            setFlashMessage(res.data.message);
            setIsVisible(true);
        } catch (err) {
            setFlashType(err.response.data.flashType);
            setFlashMessage(err.response.data.message);
            setIsVisible(true);
        }
    }

    const submitOptions = {
        username: {
            required: "Username is required",
        },
        password: {
            required: "Password is required",
            pattern: {
                value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                message: "Password must contain at least one digit, one lowercase letter, one uppercase letter, and be at least 8 characters long",
            }
        },
        email: {
            required: "Email is required",
            pattern: {
                value: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/,
                message: "Please enter a valid email",
            }
        }
    }

    return (
        <>
            {
              isVisible ?
                  <div className="flex flex-row w-full justify-end items-center">
                      <FlashCard />
                  </div>
                  : null
            }
            <section className='flex w-full h-screen'>
                <div className='flex flex-col justify-center items-center w-1/2 h-screen'>
                    <Typography variant="h3" sx={{ marginBottom: 2 }} color="initial">Welcome to Quizaroo!</Typography>
                    <AuthAnimation page={'signup'} />
                </div>
                <div className="flex items-center justify-center w-1/2 px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
                    <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
                        <h2 className="text-center text-2xl font-bold leading-tight text-black">
                            Sign Up
                        </h2>
                        <p className="mt-2 text-center text-base text-gray-600">
                            Already have an account?{' '}
                            <a
                                href="/login"
                                title=""
                                className="font-medium text-black transition-all duration-200 hover:underline"
                            >
                                Sign In
                            </a>
                        </p>
                        <form noValidate onSubmit={handleSubmit(submitForm)}>
                            <div className="space-y-5">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="email" className="text-base font-medium text-gray-900">
                                            {' '}
                                            Email{' '}
                                        </label>
                                    </div>
                                    <div className="flex flex-col items-start mt-2">
                                        <input
                                            className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                            type="email"
                                            placeholder="Email"
                                            id="email"
                                            name="email"
                                            {...register("email", submitOptions.email)}
                                        ></input>
                                        {
                                            errors.email?.type && <p className='text-red-500'>{errors.email.message}</p>
                                        }
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="username" className="text-base font-medium text-gray-900">
                                            {' '}
                                            Create a username{' '}
                                        </label>
                                    </div>
                                    <div className="flex flex-col items-start mt-2">
                                        <input
                                            className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                            type="text"
                                            placeholder="Username"
                                            id="username"
                                            name="username"
                                            {...register("username", submitOptions.username)}
                                        ></input>
                                        {
                                            errors.username?.type && <p className='text-red-500'>{errors.username.message}</p>
                                        }
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password" className="text-base font-medium text-gray-900">
                                            {' '}
                                            Password{' '}
                                        </label>
                                    </div>
                                    <div className="flex flex-col items-start mt-2">
                                        <input
                                            className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                            type="password"
                                            placeholder="Password"
                                            id="password"
                                            name="password"
                                            {...register("password", submitOptions.password)}
                                        ></input>
                                        {
                                            errors.password?.type && <p className='text-red-500'>{errors.password.message}</p>
                                        }
                                    </div>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                                    >
                                        Sign Up <ArrowRight className="ml-2" size={16} />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}