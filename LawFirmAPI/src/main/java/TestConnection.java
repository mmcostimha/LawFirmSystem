import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class TestConnection {
    public static void main(String[] args) {
        System.out.println(System.getenv("DB_PASSWORD"));
    }
}
