package com.example.LawFirmAPI.exceptions;

public class ResourceNotFound extends RuntimeException{

        public ResourceNotFound(String msm){
            super(msm);
        }
}
