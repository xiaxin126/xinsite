package com.xinsite.common.uitls.codec;

import com.xinsite.common.uitls.lang.ExceptionUtils;
import org.apache.commons.lang3.Validate;

import java.io.IOException;
import java.io.InputStream;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.security.SecureRandom;

/**
 * 不可逆加密工具类
 * @author www.xinsite.vip
 */
public class DigestUtils {

	private static SecureRandom random = new SecureRandom();

	/**
	 * 生成随机的Byte[]作为salt密钥.
	 * @param numBytes byte数组的大小
	 */
	public static byte[] genSalt(int numBytes) {
		Validate.isTrue(numBytes > 0, "numBytes argument must be a positive integer (1 or larger)", numBytes);
		byte[] bytes = new byte[numBytes];
		random.nextBytes(bytes);
		return bytes;
	}
	
	/**
	 * 对字符串进行散列, 支持md5与sha1算法.
	 * @param input 需要散列的字符串
	 * @param algorithm 散列算法（"SHA-1"、"MD5"）
	 * @param salt
	 * @param iterations 迭代次数
	 * @return
	 */
	public static byte[] digest(byte[] input, String algorithm, byte[] salt, int iterations) {
		try {
			MessageDigest digest = MessageDigest.getInstance(algorithm);

			if (salt != null) {
				digest.update(salt);
			}

			byte[] result = digest.digest(input);

			for (int i = 1; i < iterations; i++) {
				digest.reset();
				result = digest.digest(result);
			}
			return result;
		} catch (GeneralSecurityException e) {
			throw ExceptionUtils.unchecked(e);
		}
	}

	/**
	 * 对文件进行sha1散列.
	 * @param input 需要散列的流
	 * @param algorithm 散列算法（"SHA-1"、"MD5"）
	 */
	public static byte[] digest(InputStream input, String algorithm) throws IOException {
		try {
			MessageDigest messageDigest = MessageDigest.getInstance(algorithm);
			int bufferLength = 8 * 1024;
			byte[] buffer = new byte[bufferLength];
			int read = input.read(buffer, 0, bufferLength);

			while (read > -1) {
				messageDigest.update(buffer, 0, read);
				read = input.read(buffer, 0, bufferLength);
			}

			return messageDigest.digest();
		} catch (GeneralSecurityException e) {
			throw ExceptionUtils.unchecked(e);
		}
	}
	
}
