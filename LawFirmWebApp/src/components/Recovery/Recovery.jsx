import {useId, useRef, useState} from 'react'
//styles
import styles from "./Recovery.module.css"
//api
import apiRequest from "../../data/apiRequest"

export default function Recovery({setPassRecoveryFormVisible}) {

    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [code, setCode] = useState(new Array(6).fill(""));
    const [userId, setUserId] = useState(null);
    const inputs = useRef([]);
    const [resetPass, setResetPass] = useState(false)
    const [confimed, setConfirmed] = useState(false)
    const [recoveryInfo, setRecoveryInfo] = useState(null)

    

    const sendRecoveryRequest = async (e)=>{
        
        e.preventDefault()
        const link = "/auth/recovery/" + email;
        
        try{
            const responce = await apiRequest(link,"POST",null, null)
            if(responce.status==200){
                // console.log("retorno do recovery",responce.data);
                setRecoveryInfo(responce.data);
                setResetPass(true);
            }
        }catch (err){
            console.error(err);
            
        }
    }
    const setPassword = async (e)=>{
        
        e.preventDefault()
        const link = "/auth/recovery/password/" + userId + "/" + pass;
        
        try{
            const responce = await apiRequest(link,"PUT",null, null)
            if(responce.status==200){
                alert("Palavra passe alterada")
                setPassRecoveryFormVisible(false)
            }
        }catch (err){
            console.error(err);
            
        }
    }
    const handlePaste = (e) => {
        const data = e.clipboardData.getData("text").trim();
        if (data.length === 6 && !isNaN(data)) {
            setCode(data.split(""));
            inputs.current[5].focus(); // Pula para o último
        }
    };
    const confirmCode = async (e)=>{
        e.preventDefault()
        const link = "/auth/recovery";
        
        const codigoFinal = code.join("");
        // console.log("Enciado ",{codeId: recoveryInfo.codeId, createdDate: recoveryInfo.createdDate, code: codigoFinal});

        try{
            const response = await apiRequest(link, "POST", {codeId: recoveryInfo.codeId, createdDate: recoveryInfo.createdDate, code: codigoFinal}, null);
            if(response.status==200){
                // console.log("retorno do recovery",response.data);
                setUserId(response.data)
                setConfirmed(true)
            }
        }catch (err){
            console.error(err);
            
        }
    }
    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        const newCode = [...code];
        newCode[index] = element.value;
        setCode(newCode);

        // Focar no próximo quadradinho se houver um valor
        if (element.value !== "" && index < 5) {
            inputs.current[index + 1].focus();
        }
    };
    const handleKeyDown = (e, index) => {
        // Voltar para o quadradinho anterior ao apagar (Backspace)
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };
    return (
        <div className={styles.container}>
            
            {
                resetPass ?
                <>
                    <div className={styles.titleContainer}>
                        <h2> Codigo de confirmção</h2>
                    </div>
                    {confimed? 
                        <form className={styles.formContainer} onSubmit={(e) => setPassword(e)}>
                        
                            <input
                                type="password"
                                placeholder="Digite a nova passe"
                                value={pass}
                                onChange={(e) => setPass(e.target.value)}
                            />
                            <button type="submit">Confirmar</button>
                        </form>                        
                    :
                        <form className={styles.formContainer} onSubmit={(e) => confirmCode(e)}>
                            <div className={styles.digit}>
                                {code.map((data, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength="1"
                                        ref={(el) => (inputs.current[index] = el)}
                                        value={data}
                                        onChange={(e) => handleChange(e.target, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        onPaste={index === 0 ? handlePaste : null}
                                    />
                                ))}
                            </div>
                            <button type="submit">Confirmar</button>
                        </form>
                    }
                </>
                :
                <>
                    <div className={styles.titleContainer}>
                        <h2>Recuperar Senha</h2>
                    </div>
                    <form className={styles.formContainer} onSubmit={(e) => sendRecoveryRequest(e)}>
                        <input
                            type="email"
                            placeholder="Digite seu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className={styles.buttonContainer}>

                            <button onClick={() => setPassRecoveryFormVisible(false)}>Back</button>
                            <button type="submit">Enviar</button>

                        </div>
                    </form>      
                </>
            }
        </div>
    )
}
